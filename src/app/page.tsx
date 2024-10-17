import Head from "next/head";

import Header from "@/components/Header";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal-POC',
  description: 'Bienvenido a Portal-POC, una aplicación Next.js',
};


export default function Home() {
  return (

      <Header />

  );
}
