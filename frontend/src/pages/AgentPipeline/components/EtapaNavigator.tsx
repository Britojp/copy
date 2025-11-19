import { ChevronRight, Check } from 'lucide-react';

type EtapaNavigatorProps = {
  currentStep: number;
  completedSteps: Set<number>;
  allCompleted: boolean;
  onStepClick: (step: number) => void;
  loadingStep?: number | null;
};

const steps = [
  { number: 1, label: 'Parâmetros' },
  { number: 2, label: 'Buscador de Datas' },
  { number: 3, label: 'Resultados' },
];

export function EtapaNavigator({
  currentStep,
  completedSteps,
  allCompleted,
  onStepClick,
  loadingStep,
}: EtapaNavigatorProps) {
  const isStepAccessible = (step: number) => {
    if (allCompleted) return true;
    if (step === 1) return true;
    return completedSteps.has(step - 1);
  };

  return (
    <div className="flex items-center justify-between gap-2 mb-4 overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.has(step.number);
        const isCurrent = currentStep === step.number;
        const isAccessible = isStepAccessible(step.number);
        const isClickable = allCompleted || isAccessible;
        const isLoading = loadingStep === step.number;

        return (
          <div key={step.number} className="flex items-center flex-1 min-w-0">
            <button
              onClick={() => isClickable && onStepClick(step.number)}
              disabled={!isClickable || isLoading}
              className={`
                flex items-center gap-2 flex-1 min-w-0
                ${isClickable && !isLoading ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                ${isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'}
              `}
            >
              <div
                className={`
                  flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0
                  ${isCurrent ? 'bg-primary text-primary-foreground' : ''}
                  ${isCompleted && !isCurrent ? 'bg-green-500/20 text-green-600 dark:text-green-400' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-muted text-muted-foreground' : ''}
                `}
              >
                {isLoading ? (
                  <div
                    className={`h-3 w-3 border-2 border-t-transparent rounded-full animate-spin ${
                      isCurrent
                        ? 'border-primary-foreground'
                        : isCompleted
                        ? 'border-green-600 dark:border-green-400'
                        : 'border-muted-foreground'
                    }`}
                  ></div>
                ) : isCompleted && isClickable ? (
                  <Check size={14} className={isCurrent ? 'text-primary-foreground' : 'text-green-600 dark:text-green-400'} />
                ) : (
                  <span className="text-xs">{step.number}</span>
                )}
              </div>
              <span className="text-xs truncate hidden sm:inline">{step.label}</span>
            </button>
            {index < steps.length - 1 && (
              <ChevronRight
                size={16}
                className={`flex-shrink-0 mx-1 ${
                  isCompleted ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

