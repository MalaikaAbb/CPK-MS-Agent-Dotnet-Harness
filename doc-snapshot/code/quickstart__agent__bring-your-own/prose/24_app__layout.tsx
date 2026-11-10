import { Providers } from "./providers"; // [!code highlight]
import "@copilotkit/react-core/v2/styles.css";
import './globals.css';

export default function RootLayout({ children }: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        {/* [!code highlight:3] */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
