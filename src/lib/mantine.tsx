import { createEmotionCache, MantineProvider as OriginalMantineProvider } from '@mantine/core';
import type { MantineThemeOverride } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';

const theme: MantineThemeOverride = {
  datesLocale: 'id',
  loader: 'dots',
  primaryColor: 'pink',
};

const appendCache = createEmotionCache({ key: 'app', prepend: true });

export default function MantineProvider({ children }: { children: React.ReactNode }) {
  return (
    <OriginalMantineProvider theme={theme} emotionCache={appendCache}>
      <NotificationsProvider>
        <ModalsProvider>{children}</ModalsProvider>
      </NotificationsProvider>
    </OriginalMantineProvider>
  );
}
