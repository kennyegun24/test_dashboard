import { toast } from "@/hooks/use-toast";

export const sendToast = ({ variant, title, desc }) => {
  toast({
    variant: variant,
    title: title,
    description: desc,
  });
};

export function kFormatter(num) {
  const absNum = Math.abs(num);
  if (absNum >= 1e9) {
    return Math.sign(num) * (absNum / 1e9).toFixed(2) + "B";
  } else if (absNum >= 1e6) {
    return Math.sign(num) * (absNum / 1e6).toFixed(2) + "M";
  } else if (absNum >= 1e3) {
    return Math.sign(num) * (absNum / 1e3).toFixed(2) + "k";
  } else {
    return Math.sign(num) * absNum;
  }
}
