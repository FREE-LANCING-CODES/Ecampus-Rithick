import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  // Login action
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      // Save ALL fields to localStorage
      const userData = {
        id: user.id,
        userId: user.userId,
        name: user.name,
        role: user.role,
        email: user.email,
        department: user.department,
        year: user.year,
        semester: user.semester,
        rollNumber: user.rollNumber,
        phone: user.phone,
        gender: user.gender,
        bloodGroup: user.bloodGroup,
        dateOfBirth: user.dateOfBirth,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      set({
        user: userData,
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

     return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Logout action
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;