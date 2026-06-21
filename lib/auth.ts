/** Remove legacy JWT from localStorage (pre–httpOnly migration). */
export const clearLegacyToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};
