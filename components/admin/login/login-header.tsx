import Image from "next/image";

export function LoginHeader() {
  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center justify-center mb-6">
        <Image
          src="/logo.png"
          alt="PAM Techno Logo"
          width={400}
          height={400}
          className="w-56 sm:w-64 md:w-72 lg:w-80 h-auto object-contain"
          priority
        />
      </div>
      <p className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-primary mb-3">
        Admin Login
      </p>
      <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
        Masuk ke dashboard untuk mengelola proyek
      </p>
    </div>
  );
}
