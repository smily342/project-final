import { create } from 'zustand';

const useStore = create((set) => ({
    selectedCategory: 'saved',
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    savedBooks: {},
    setSavedBooks: (books) => set({ savedBooks: books }),
    likedBooks: {},
    setLikedBooks: (books) => set({ likedBooks: books }),
    recommendedBooks: [],
    setRecommendedBooks: (books) => set({ recommendedBooks: books }),
    loading: false,
    setLoading: (loading) => set({ loading }),
    error: null,
    setError: (error) => set({ error }),
}));

export default useStore;
