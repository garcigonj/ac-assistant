export const metadata = {
  title: "A/C Assistant",
  description: "Diagnóstico asistido para técnicos de climatización"
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
