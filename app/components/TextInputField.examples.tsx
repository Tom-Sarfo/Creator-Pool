// Example usage of TextInputField component
import TextInputField from "./TextInputField";
import {
  faUser,
  faEnvelope,
  faLock,
  faSearch,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";

export function TextInputFieldExamples() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">
        TextInputField Component Examples
      </h2>

      {/* Basic Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Examples</h3>

        {/* Small Size */}
        <TextInputField
          value=""
          onChange={() => {}}
          placeholder="Small input"
          size="small"
          label="Small Input"
        />

        {/* Medium Size (Default) */}
        <TextInputField
          value=""
          onChange={() => {}}
          placeholder="Medium input"
          size="medium"
          label="Medium Input"
        />

        {/* Large Size */}
        <TextInputField
          value=""
          onChange={() => {}}
          placeholder="Large input"
          size="large"
          label="Large Input"
        />
      </div>

      {/* Icon Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Icons</h3>

        {/* Left Icon */}
        <TextInputField
          value=""
          onChange={() => {}}
          placeholder="Enter your name"
          leftIcon={faUser}
          label="Name Input"
          iconColor="text-blue-600"
        />

        {/* Right Icon */}
        <TextInputField
          value=""
          onChange={() => {}}
          placeholder="Search..."
          rightIcon={faSearch}
          label="Search Input"
          iconColor="text-gray-500"
        />

        {/* Dollar Sign Icon */}
        <TextInputField
          value=""
          onChange={() => {}}
          placeholder="0.00"
          type="number"
          leftIcon={faDollarSign}
          label="Price Input"
          iconColor="text-green-600"
          borderColor="border-green-300"
          focusBorderColor="focus:border-green-500"
        />
      </div>

      {/* Color Customization */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Color Customization</h3>

        {/* Orange Theme */}
        <TextInputField
          value=""
          onChange={() => {}}
          placeholder="Orange theme"
          label="Orange Theme"
          borderColor="border-orange-300"
          focusBorderColor="focus:border-orange-500"
          textColor="text-orange-900"
          backgroundColor="bg-orange-50"
        />

        {/* Blue Theme */}
        <TextInputField
          value=""
          onChange={() => {}}
          placeholder="Blue theme"
          label="Blue Theme"
          borderColor="border-blue-300"
          focusBorderColor="focus:border-blue-500"
          textColor="text-blue-900"
          backgroundColor="bg-blue-50"
        />

        {/* Purple Theme */}
        <TextInputField
          value=""
          onChange={() => {}}
          placeholder="Purple theme"
          label="Purple Theme"
          borderColor="border-purple-300"
          focusBorderColor="focus:border-purple-500"
          textColor="text-purple-900"
          backgroundColor="bg-purple-50"
        />
      </div>

      {/* Error States */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Error States</h3>

        {/* With Error */}
        <TextInputField
          value="invalid@email"
          onChange={() => {}}
          placeholder="Enter email"
          type="email"
          leftIcon={faEnvelope}
          label="Email Input"
          error="Please enter a valid email address"
          errorBorderColor="border-red-500"
        />

        {/* Required Field */}
        <TextInputField
          value=""
          onChange={() => {}}
          placeholder="Required field"
          label="Required Field"
          required={true}
          helperText="This field is required"
        />
      </div>

      {/* Specialized Inputs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Specialized Inputs</h3>

        {/* Password Input */}
        <TextInputField
          value=""
          onChange={() => {}}
          placeholder="Enter password"
          type="password"
          leftIcon={faLock}
          label="Password"
          helperText="Must be at least 8 characters"
        />

        {/* Number Input with Min/Max */}
        <TextInputField
          value=""
          onChange={() => {}}
          placeholder="Enter age"
          type="number"
          label="Age"
          min={0}
          max={120}
          helperText="Enter your age"
        />

        {/* Full Width Input */}
        <TextInputField
          value=""
          onChange={() => {}}
          placeholder="Full width input"
          label="Full Width Input"
          fullWidth={true}
          helperText="This input takes full width"
        />
      </div>

      {/* Disabled State */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Disabled State</h3>

        <TextInputField
          value="Disabled value"
          onChange={() => {}}
          placeholder="This is disabled"
          label="Disabled Input"
          disabled={true}
          helperText="This input is disabled"
        />
      </div>
    </div>
  );
}

export default TextInputFieldExamples;
