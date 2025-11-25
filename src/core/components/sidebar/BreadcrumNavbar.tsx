"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/core/components/shadcn/breadcrumb";
import { usePathname } from "next/navigation";

export const BreadcrumbNavbar = () => {
  const pathname = usePathname();
  const pathNameToShow = pathname.split("/").at(1)?.toUpperCase();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="block">
          <BreadcrumbLink>PeopleFlow Candidates</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{pathNameToShow}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
