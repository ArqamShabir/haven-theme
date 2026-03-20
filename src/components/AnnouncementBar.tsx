import { useSettingsStore } from '@/stores/settingsStore';

const AnnouncementBar = () => {
  const text = useSettingsStore(s => s.announcementText);

  return (
    <div className="h-9 bg-foreground text-background flex items-center justify-center">
      <p className="caps-label text-[11px] text-background">
        {text}
      </p>
    </div>
  );
};

export default AnnouncementBar;
