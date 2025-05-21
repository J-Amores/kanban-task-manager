import { toast } from '@/components/ui/use-toast';

export interface ApiError {
  message: string;
  status?: number;
}

export function handleError(error: unknown) {
  console.error(error);
  
  // Handle ApiError
  if (error && typeof error === 'object' && 'message' in error) {
    toast({
      title: 'Error',
      description: error.message as string,
      variant: 'destructive',
    });
    return;
  }
  
  // Handle other errors
  toast({
    title: 'Error',
    description: 'An unexpected error occurred',
    variant: 'destructive',
  });
}
