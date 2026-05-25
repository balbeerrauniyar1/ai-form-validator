'use client';
import { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
  validation?: Record<string, any>;
}

interface FormBuilderProps {
  onSave: (fields: Field[]) => void;
  initialFields?: Field[];
}

export function FormBuilder({ onSave, initialFields = [] }: FormBuilderProps) {
  const [fields, setFields] = useState<Field[]>(initialFields);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newField, setNewField] = useState<Partial<Field>>({
    type: 'text',
    required: false,
  });

  const handleAddField = () => {
    if (!newField.name) return;
    
    const field: Field = {
      id: Date.now().toString(),
      name: newField.name || '',
      type: newField.type || 'text',
      required: newField.required || false,
    };
    
    setFields([...fields, field]);
    setNewField({ type: 'text', required: false });
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleSave = () => {
    onSave(fields);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Form Builder</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-4">Add Field</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Field name"
            value={newField.name || ''}
            onChange={(e) => setNewField({ ...newField, name: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <select
            value={newField.type || 'text'}
            onChange={(e) => setNewField({ ...newField, type: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="number">Number</option>
            <option value="phone">Phone</option>
            <option value="date">Date</option>
            <option value="select">Select</option>
            <option value="checkbox">Checkbox</option>
            <option value="textarea">Textarea</option>
          </select>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newField.required || false}
              onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
              className="w-4 h-4"
            />
            <span>Required</span>
          </label>
          <button
            onClick={handleAddField}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={18} /> Add
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-lg mb-4">Form Fields ({fields.length})</h3>
        {fields.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No fields added yet</p>
        ) : (
          fields.map((field) => (
            <div key={field.id} className="flex items-center justify-between bg-gray-50 p-4 rounded">
              <div className="flex-1">
                <p className="font-medium">{field.name}</p>
                <p className="text-sm text-gray-600">
                  {field.type} {field.required && '(Required)'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingId(field.id)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteField(field.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-green-600 text-white px-4 py-3 rounded font-semibold hover:bg-green-700 mt-6"
      >
        Save Form
      </button>
    </div>
  );
}
