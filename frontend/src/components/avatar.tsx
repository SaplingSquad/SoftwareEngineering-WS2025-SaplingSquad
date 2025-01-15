import { component$ } from "@builder.io/qwik";

/**
 * Small avatar-component
 */
export const Avatar = component$(
  ({ icon, alt }: { icon: string; alt: string }) => (
    <div class="avatar">
      <div class="w-24 rounded-box">
        <img
          src={icon}
          alt={alt}
          // Default size; will be overwritten by css
          width="1"
          height="1"
        />
      </div>
    </div>
  ),
);
