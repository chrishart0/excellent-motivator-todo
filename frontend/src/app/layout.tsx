// frontend/src/app/layout.tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] }); // Add the font with its subsets

// Components
import Navigation from '@/components/Navigation';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';

export const metadata = {
  title: 'Excellent Motivator - Your Personal Motivator',
  description: 'Excellent Motivator - Your Personal Motivator',
};

const DRAWER_WIDTH = 340;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}> {/* Add the font to the body */}
        <ThemeRegistry>
          {/* <NavBar drawerWidth={DRAWER_WIDTH} /> */}
          <Navigation />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: 'background.default',
              // ml: `${DRAWER_WIDTH}px`,
              mt: ['48px', '56px', '64px'],
              p: 3,
            }}
          >
            {children}
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
