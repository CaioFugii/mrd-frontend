export function logoutOn401() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
