const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-sidebar-background/80">
        <img
          src="/logo.png"
          alt="Tech Wiser Consulting Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-base font-bold text-sidebar-foreground leading-tight">
          TECH WISER CONSULTING
        </span>
        <span className="text-[11px] text-sidebar-foreground/70 leading-tight">
          SOFTWARE HOUSE
        </span>
      </div>
    </div>
  );
};

export default Logo;
