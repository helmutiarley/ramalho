import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-2xl border text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.28)]',
	{
		variants: {
			variant: {
				default: 'border-primary/10 bg-gradient-to-r from-primary/90 to-primary text-primary-foreground hover:-translate-y-0.5 hover:from-primary hover:to-primary/90',
				destructive:
          'border-destructive/10 bg-destructive text-destructive-foreground hover:-translate-y-0.5 hover:bg-destructive/90',
				outline:
          'border-white/10 bg-background/70 backdrop-blur-sm hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground',
				secondary:
          'border-white/10 bg-secondary/70 text-secondary-foreground hover:-translate-y-0.5 hover:bg-secondary/90',
				ghost: 'border-transparent bg-transparent shadow-none hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 px-3',
				lg: 'h-11 px-8',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : 'button';
	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			ref={ref}
			{...props}
		/>
	);
});
Button.displayName = 'Button';

export { Button, buttonVariants };
