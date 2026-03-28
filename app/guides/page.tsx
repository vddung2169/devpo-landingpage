"use client";

import React from "react";
import { Header } from "../components/header";
import { IphoneLockGuides } from "../components/guides";
import { SiteFooter } from "../components/footer";


export default function GuidesPage() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      

        <IphoneLockGuides hideViewAll itemsPerPage={8} />
     
      
    </main>
  );
}
