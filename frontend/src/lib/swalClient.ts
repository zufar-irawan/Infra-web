"use client";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export function showError(title: string, text?: string) {
  MySwal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#f97316",
    timer: 5000,
  });
}

export function showWarning(title: string, text?: string) {
  MySwal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonColor: "#f97316",
  });
}

export function showInfo(title: string, text?: string) {
  MySwal.fire({
    icon: "info",
    title,
    text,
    confirmButtonColor: "#f97316",
  });
}

