import { useEffect, useState } from "react";
import { checkApiServerHealth } from "@/services/apiServer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const getServicesStatusText = (apiServerIsHealthy: boolean | null) => {
  if (apiServerIsHealthy === null) {
    return "checking services";
  }

  return apiServerIsHealthy ? "all services up" : "API service down";
};

const getServicesStatusClassName = (apiServerIsHealthy: boolean | null) => {
  if (apiServerIsHealthy === null) {
    return "bg-muted-foreground";
  }

  return apiServerIsHealthy ? "bg-green-500" : "bg-red-500";
};

const Footer = () => {
  const [apiServerIsHealthy, setApiServerIsHealthy] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    checkApiServerHealth()
      .then(setApiServerIsHealthy)
      .catch(() => setApiServerIsHealthy(false));
  }, []);

  const servicesStatusText = getServicesStatusText(apiServerIsHealthy);

  return (
    <footer className="border-t px-4 py-1.5">
      <div className="mx-auto flex max-w-5xl justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                aria-label={servicesStatusText}
                className={`block h-3 w-3 rounded-full ${getServicesStatusClassName(apiServerIsHealthy)}`}
                tabIndex={0}
              />
            </TooltipTrigger>
            <TooltipContent side="top">{servicesStatusText}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </footer>
  );
};

export default Footer;
