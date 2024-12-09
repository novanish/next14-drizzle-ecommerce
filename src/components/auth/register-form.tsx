"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { emailRegister } from "@/server/actions/email-register";
import { RegisterSchema, registerSchema } from "@/types/register-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { AuthCard } from "./auth-card";
import { useToast } from "@/hooks/use-toast";

export function RegisterForm() {
  const { toast } = useToast();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });
  const { execute, isPending } = useAction(emailRegister, {
    onSuccess: ({ data }) => {
      if (data?.message) {
        toast({
          variant: "default",
          description: data.message,
        });
      }

      if (data?.error) {
        toast({
          variant: "destructive",
          description: data.error,
        });
      }
    },
  });

  function onSubmit(data: RegisterSchema) {
    execute(data);
  }

  return (
    <AuthCard
      cardTitle="Create an account"
      backButtonHref="/auth/login"
      backButtonText="Already have an account?"
      showSocialLogin
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="my-7">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className={cn("mt-7 w-full", isPending ? "animate-pulse" : "")}
            disabled={isPending}
          >
            Register
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
