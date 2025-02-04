"use client";

import { cn } from "/src/@/lib/utils";
import { Button } from "/src/@/components/ui/button";
import { Input } from "/src/@/components/ui/input";
import { Label } from "/src/@/components/ui/label";

import { useRouter } from "next/navigation";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

import { useToast } from "/src/@/hooks/use-toast";

import { signIn } from "/src/@/services/authService";

interface LoginFormInputs {
  email: string;
  password: string;
}

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { toast } = useToast();
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    setErrorMessage("");

    toast({
      variant: "default",
      title: "Fazendo login...",
    });

    try {
      const result = await signIn({
        EMAIL: data.email,
        PASSWORD: data.password,
      });
      console.log("Login bem-sucedido!", result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: error.message,
        });
      } else {
        setErrorMessage("Erro inesperado.");
        toast({
          variant: "destructive",
          title: "Erro inesperado",
          description: "Ocorreu um erro desconhecido ao tentar fazer login.",
        });
      }
    } finally {
      console.warn(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit(onSubmit)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Faça login para sua conta</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Preencha o email e senha abaixo para logar.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="seuemail@email.com" 
            {...register("email", { required: "O email é obrigatório" })} 
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu sua Senha?
            </a>
          </div>
          <Input 
            id="password" 
            type="password" 
            {...register("password", { required: "A senha é obrigatória" })} 
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          { isLoading ? "Carregando..." : "Login" }
        </Button>
      </div>
      <div className="text-center text-sm">
        Não tem uma conta?{" "}
        <a href="#" className="underline underline-offset-4">
          Criar uma conta
        </a>
      </div>
    </form>
  );
}