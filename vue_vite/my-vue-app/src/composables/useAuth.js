import { computed, ref } from "vue";

export function useAuth() {
  const userRole = ref(localStorage.getItem("role"));
  const isAdmin = computed(() => userRole.value === "admin" || userRole.value === "professor");

  return { userRole, isAdmin };
}
