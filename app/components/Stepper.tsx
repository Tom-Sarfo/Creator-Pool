import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faClock,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

export interface StepperStep {
  id: string;
  title: string;
  description: string;
  date?: string;
  completed: boolean;
  icon?: "check" | "clock" | "play";
}

interface StepperProps {
  steps: StepperStep[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const getStepIcon = (step: StepperStep) => {
  if (step.completed) {
    return (
      <FontAwesomeIcon
        icon={faCheckCircle}
        className="w-4 h-4 text-orange-600"
      />
    );
  }

  switch (step.icon) {
    case "play":
      return (
        <FontAwesomeIcon icon={faPlay} className="w-3 h-3 text-gray-600" />
      );
    case "clock":
    default:
      return (
        <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-gray-400" />
      );
  }
};

export default function Stepper({
  steps,
  orientation = "horizontal",
  className = "",
}: StepperProps) {
  if (orientation === "vertical") {
    return (
      <div className={`space-y-4 ${className}`}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed ? "bg-orange-100" : "bg-gray-100"
                }`}
              >
                {getStepIcon(step)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={`text-sm font-medium ${step.completed ? "text-gray-900" : "text-gray-500"}`}
              >
                {step.title}
              </div>
              <div
                className={`text-xs ${step.completed ? "text-gray-600" : "text-gray-400"}`}
              >
                {step.date}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {step.description}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="absolute left-7 mt-8 w-0.5 h-6 bg-gray-200"></div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Horizontal orientation
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed ? "bg-orange-100" : "bg-gray-100"
                }`}
              >
                {getStepIcon(step)}
              </div>
              <span
                className={`text-xs mt-2 text-center ${step.completed ? "text-gray-900" : "text-gray-500"}`}
              >
                {step.title}
              </span>
              <span
                className={`text-xs text-center ${step.completed ? "text-gray-600" : "text-gray-400"}`}
              >
                {step.date}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-4 ${
                  steps[index + 1].completed ? "bg-orange-200" : "bg-gray-200"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
