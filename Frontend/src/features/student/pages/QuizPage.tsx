import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '@/components/ui';
import { useToastStore } from '@/store/toastStore';
import { mockQuiz } from '@/mocks/quizzes';
import { cn } from '@/lib/utils/cn';

type AnswerValue = number | boolean;

export function QuizPage() {
  const { t } = useTranslation();
  const addToast = useToastStore((state) => state.addToast);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  const setAnswer = (questionId: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    addToast({ type: 'success', message: 'تم إرسال إجاباتك بنجاح' });
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <h1 className="font-cairo text-2xl font-bold text-text-primary">{mockQuiz.title}</h1>

      <div className="flex flex-col gap-4">
        {mockQuiz.questions.map((question, index) => (
          <Card key={question.id} padding="lg" className="flex flex-col gap-4">
            <h3 className="font-cairo text-base font-semibold text-text-primary">
              {index + 1}. {question.question}
            </h3>

            {question.type === 'true_false' ? (
              <div className="flex gap-3">
                {[true, false].map((value) => (
                  <Button
                    key={String(value)}
                    variant={answers[question.id] === value ? 'primary' : 'outline'}
                    onClick={() => setAnswer(question.id, value)}
                    className="flex-1"
                  >
                    {value ? 'صح' : 'خطأ'}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {question.options?.map((option, optionIndex) => {
                  const isSelected = answers[question.id] === optionIndex;
                  return (
                    <button
                      key={optionIndex}
                      type="button"
                      onClick={() => setAnswer(question.id, optionIndex)}
                      className={cn(
                        'flex items-center gap-3 rounded-input border p-3 text-start font-cairo text-sm transition-colors',
                        isSelected
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border text-text-primary hover:bg-gray-100',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                          isSelected ? 'border-accent' : 'border-text-secondary',
                        )}
                      >
                        {isSelected && <span className="h-2 w-2 rounded-full bg-accent" />}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        ))}
      </div>

      <Button onClick={handleSubmit} className="self-end">
        {t('actions.submit')}
      </Button>
    </div>
  );
}
