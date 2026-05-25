import create from 'zustand';

interface FormData {
  id: string;
  name: string;
  fields: any[];
  createdAt: number;
  updatedAt: number;
}

interface FormState {
  forms: FormData[];
  currentForm: FormData | null;
  setForms: (forms: FormData[]) => void;
  setCurrentForm: (form: FormData | null) => void;
  addForm: (form: FormData) => void;
  updateForm: (form: FormData) => void;
  deleteForm: (id: string) => void;
}

export const useFormStore = create<FormState>((set) => ({
  forms: [],
  currentForm: null,
  setForms: (forms) => set({ forms }),
  setCurrentForm: (form) => set({ currentForm: form }),
  addForm: (form) => set((state) => ({ forms: [...state.forms, form] })),
  updateForm: (form) => set((state) => ({
    forms: state.forms.map((f) => (f.id === form.id ? form : f)),
    currentForm: state.currentForm?.id === form.id ? form : state.currentForm,
  })),
  deleteForm: (id) => set((state) => ({
    forms: state.forms.filter((f) => f.id !== id),
    currentForm: state.currentForm?.id === id ? null : state.currentForm,
  })),
}));
