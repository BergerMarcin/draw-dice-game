import Swal from "sweetalert2";

export const showConfirmation = async function (msg) {
  return Swal.fire({
    title: msg,
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "Yes",
    background: "#066920",
  });
};

export const showWarning = async function (msg) {
  return Swal.fire({
    title: msg,
    showCancelButton: false,
    background: "#066920",
  });
};

export const showError = async function (msg) {
  return Swal.fire({
    title: "Error Message",
    text: msg,
    icon: "error",
    showCancelButton: false,
    background: "#066920",
  });
};
