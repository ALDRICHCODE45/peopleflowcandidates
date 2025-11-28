import { Separator } from "@/core/components/shadcn/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/core/components/shadcn/sidebar";
import { AppSidebar } from "@/core/components/sidebar/AppSidebar";
import { BreadcrumbNavbar } from "@/core/components/sidebar/BreadcrumNavbar";
import { ThemeToogle } from "@/core/components/ThemeToogle";
import { ThemeProvider } from "@/core/shared/providers/ThemeProvider";
import { Metadata } from "next";
import { AuthGuard } from "@/core/shared/providers/AuthGuard";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "PeopleFlow Candidates",
  description: "Gestiona los candidatos ingresados en este apartado",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SessionProvider>
          <AuthGuard>
            <SidebarProvider defaultOpen={false}>
              <AppSidebar />
              <SidebarInset className="flex flex-col min-h-screen w-full min-w-0">
                <header className="sticky bg-white dark:bg-black top-0 z-50 flex justify-between w-full h-16 shrink-0 items-center gap-2 border-b min-w-0">
                  <div className="flex items-center gap-2 px-4 min-w-0 flex-1">
                    <SidebarTrigger className="-ml-1 shrink-0" />
                    <Separator
                      orientation="vertical"
                      className="mr-2 data-[orientation=vertical]:h-4 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <BreadcrumbNavbar />
                    </div>
                  </div>
                  <div className="mr-4 sm:mr-6 md:mr-8 lg:mr-10 shrink-0">
                    <ThemeToogle />
                  </div>
                </header>
                <div className="flex-1 pt-4 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 min-w-0 w-full">
                  <div className="w-full max-w-full min-w-0 overflow-hidden">
                    {children}
                  </div>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </AuthGuard>
        </SessionProvider>
      </ThemeProvider>
    </>
  );
}
