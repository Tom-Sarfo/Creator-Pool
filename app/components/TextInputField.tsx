import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { forwardRef } from "react";

export interface TextInputFieldProps {
  // Basic props
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;

  // Label and helper text
  label?: string;
  helperText?: string;
  error?: string;

  // Size variants
  size?: "small" | "medium" | "large";

  // Icon props
  leftIcon?: IconDefinition;
  rightIcon?: IconDefinition;
  iconPosition?: "left" | "right";

  // Color customization
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  focusBorderColor?: string;
  errorBorderColor?: string;

  // Text customization
  textColor?: string;
  placeholderColor?: string;

  // Icon customization
  iconColor?: string;
  iconSize?: "xs" | "sm" | "md" | "lg" | "xl";

  // Layout
  fullWidth?: boolean;
  className?: string;

  // Event handlers
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onWheel?: (e: React.WheelEvent<HTMLInputElement>) => void;

  // Input specific
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  readOnly?: boolean;

  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

const TextInputField = forwardRef<HTMLInputElement, TextInputFieldProps>(
  (
    {
      value,
      onChange,
      placeholder,
      type = "text",
      disabled = false,
      required = false,
      name,
      id,
      label,
      helperText,
      error,
      size = "medium",
      leftIcon,
      rightIcon,
      iconPosition = "left",
      color,
      backgroundColor = "bg-white",
      borderColor = "border-gray-300",
      focusBorderColor = "focus:border-orange-500",
      errorBorderColor = "border-red-500",
      textColor = "text-gray-900",
      placeholderColor = "placeholder-gray-500",
      iconColor = "text-gray-600",
      iconSize = "sm",
      fullWidth = false,
      className = "",
      onFocus,
      onBlur,
      onKeyDown,
      onKeyUp,
      onWheel,
      min,
      max,
      step,
      pattern,
      autoComplete,
      autoFocus = false,
      readOnly = false,
      ariaLabel,
      ariaDescribedBy,
    },
    ref
  ) => {
    // Size configurations
    const sizeConfig = {
      small: {
        input: "px-3 py-1.5 text-sm",
        icon: "w-3 h-3",
        label: "text-xs",
        helper: "text-xs",
      },
      medium: {
        input: "px-3 py-2 text-sm",
        icon: "w-4 h-4",
        label: "text-sm",
        helper: "text-xs",
      },
      large: {
        input: "px-4 py-3 text-base",
        icon: "w-5 h-5",
        label: "text-base",
        helper: "text-sm",
      },
    };

    const currentSize = sizeConfig[size];
    const hasError = !!error;
    const hasLeftIcon = leftIcon && iconPosition === "left";
    const hasRightIcon = rightIcon && iconPosition === "right";

    // Dynamic classes
    const inputClasses = `
      ${currentSize.input}
      ${fullWidth ? "w-full" : ""}
      ${textColor}
      ${placeholderColor}
      ${backgroundColor}
      ${hasError ? errorBorderColor : borderColor}
      ${hasError ? "" : focusBorderColor}
      ${hasLeftIcon ? "pl-8" : ""}
      ${hasRightIcon ? "pr-8" : ""}
      border rounded-lg
      focus:ring-0
      focus:outline-none
      transition-colors duration-200
      disabled:bg-gray-100
      disabled:cursor-not-allowed
      disabled:text-gray-500
      ${className}
    `.trim();

    const iconClasses = `
      ${currentSize.icon}
      ${iconColor}
    `.trim();

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={id}
            className={`block font-medium mb-2 ${currentSize.label} ${
              hasError ? "text-red-600" : "text-gray-700"
            }`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Left Icon */}
          {hasLeftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <FontAwesomeIcon icon={leftIcon} className={iconClasses} />
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            readOnly={readOnly}
            autoFocus={autoFocus}
            autoComplete={autoComplete}
            min={min}
            max={max}
            step={step}
            pattern={pattern}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            onWheel={onWheel}
            className={inputClasses}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            aria-invalid={hasError}
          />

          {/* Right Icon */}
          {hasRightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
              <FontAwesomeIcon icon={rightIcon} className={iconClasses} />
            </div>
          )}
        </div>

        {/* Helper Text or Error */}
        {(helperText || error) && (
          <div className="mt-1">
            {error ? (
              <p className={`${currentSize.helper} text-red-600`}>{error}</p>
            ) : (
              <p className={`${currentSize.helper} text-gray-500`}>
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

TextInputField.displayName = "TextInputField";

export default TextInputField;
