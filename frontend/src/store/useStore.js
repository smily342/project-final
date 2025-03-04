import { create } from "zustand";

const useStore = create((set) => ({
    selectedCategory: "saved",
    setSelectedCategory: (category) => {
        console.log("Updating selectedCategory:", category);
        set({ selectedCategory: category });
    },
    savedBooks: [],
    setSavedBooks: (books) => {
        console.log("Updating savedBooks:", books);
        set({ savedBooks: books });
    },
    likedBooks: [],
    setLikedBooks: (books) => {
        console.log("Updating likedBooks:", books);
        set({ likedBooks: books });
    },
    recommendedBooks: [],
    setRecommendedBooks: (books) => {
        console.log("Updating recommendedBooks:", books);
        set({ recommendedBooks: books });
    },
    loading: false,
    setLoading: (loading) => {
        console.log("Updating loading state:", loading);
        set({ loading });
    },
    error: null,
    setError: (error) => {
        console.log("Updating error state:", error);
        set({ error });
    },
}));

export default useStore;
