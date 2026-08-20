import { create } from "zustand";

interface Toast {
  id: string;
  message: string;
  variant: "success" | "error" | "info";
}

interface UIState {
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  filterDrawerOpen: boolean;
  toasts: Toast[];
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setFilterDrawerOpen: (open: boolean) => void;
  showToast: (message: string, variant?: Toast["variant"]) => void;
  dismissToast: (id: string) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  mobileMenuOpen: false,
  searchOpen: false,
  filterDrawerOpen: false,
  toasts: [],
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setFilterDrawerOpen: (open) => set({ filterDrawerOpen: open }),
  showToast: (message, variant = "success") =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: `${Date.now()}-${Math.random()}`, message, variant },
      ],
    })),
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
