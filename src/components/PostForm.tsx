"use client";

import { useActionState } from "react";
import { CATEGORIES, KINDS, PLACES } from "@/data/posts";
import { CONTACT_TYPES, type PostFormState, type PostInput } from "@/lib/post-validate";

const fields = [
  { name: "title", label: "Tiêu đề" },
  { name: "kind", label: "Loại tin", options: KINDS },
  { name: "category", label: "Danh mục", options: CATEGORIES },
  { name: "place", label: "Địa điểm", options: PLACES },
  { name: "date", label: "Ngày", type: "date" },
  { name: "description", label: "Mô tả" },
  { name: "contactType", label: "Loại liên hệ", options: CONTACT_TYPES },
  { name: "contact", label: "Thông tin liên hệ" },
] satisfies { name: keyof PostInput; label: string; options?: string[]; type?: string }[];

interface PostFormProps {
  action: (prev: PostFormState, formData: FormData) => Promise<PostFormState>;
}

export default function PostForm({ action }: PostFormProps) {
  const [state, formAction, pending] = useActionState(action, { errors: {}, values: {} });

  return (
    <form className="post-form" key={JSON.stringify(state.values)} action={formAction}>
      {fields.map(({ name, label, options, type }) => {
        const id = `post-${name}`;
        const error = state.errors[name];
        const props = {
          id,
          name,
          defaultValue: state.values[name] ?? (name === "contactType" ? "Zalo" : ""),
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? `${id}-error` : undefined,
        };

        return (
          <div key={name}>
            <label htmlFor={id}>{label}</label>
            {options ? (
              <select {...props}>
                {name !== "contactType" && <option value="">-- Chọn --</option>}
                {options.map((option) => <option key={option}>{option}</option>)}
              </select>
            ) : name === "description" ? (
              <textarea {...props} rows={4} />
            ) : (
              <input {...props} type={type ?? "text"} />
            )}
            {error && <span id={`${id}-error`} role="alert">{error}</span>}
          </div>
        );
      })}
      <button type="submit" disabled={pending}>Đăng tin</button>
      {state.message && <p role={state.ok ? "status" : "alert"}>{state.message}</p>}
    </form>
  );
}
