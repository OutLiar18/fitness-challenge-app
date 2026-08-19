import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { TrendUpIcon } from "@phosphor-icons/react/dist/csr/TrendUp";
import { NotebookIcon } from "@phosphor-icons/react/dist/csr/Notebook";
import { ArrowClockwiseIcon } from "@phosphor-icons/react/dist/csr/ArrowClockwise";
import { HouseSimpleIcon } from "@phosphor-icons/react/dist/csr/HouseSimple";
import { ShieldCheckeredIcon } from "@phosphor-icons/react/dist/csr/ShieldCheckered";
import { CastleTurretIcon } from "@phosphor-icons/react/dist/csr/CastleTurret";
import { BellRingingIcon } from "@phosphor-icons/react/dist/csr/BellRinging";
import { ChartBarIcon } from "@phosphor-icons/react/dist/csr/ChartBar";
import { BackpackIcon } from "@phosphor-icons/react/dist/csr/Backpack";
import { SparkleIcon } from "@phosphor-icons/react/dist/csr/Sparkle";
import { BookOpenTextIcon } from "@phosphor-icons/react/dist/csr/BookOpenText";
import { ChartLineUpIcon } from "@phosphor-icons/react/dist/csr/ChartLineUp";
import { QuestionIcon } from "@phosphor-icons/react/dist/csr/Question";
import { GearSixIcon } from "@phosphor-icons/react/dist/csr/GearSix";
import { UserCircleIcon } from "@phosphor-icons/react/dist/csr/UserCircle";
import { DotsThreeOutlineIcon } from "@phosphor-icons/react/dist/csr/DotsThreeOutline";
import { SignOutIcon } from "@phosphor-icons/react/dist/csr/SignOut";
import { CompassRoseIcon } from "@phosphor-icons/react/dist/csr/CompassRose";
import { ClipboardTextIcon } from "@phosphor-icons/react/dist/csr/ClipboardText";
import { LightningIcon } from "@phosphor-icons/react/dist/csr/Lightning";
import { RankingIcon } from "@phosphor-icons/react/dist/csr/Ranking";
import { TrophyIcon } from "@phosphor-icons/react/dist/csr/Trophy";
import { SealCheckIcon } from "@phosphor-icons/react/dist/csr/SealCheck";
import { TicketIcon } from "@phosphor-icons/react/dist/csr/Ticket";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/csr/ArrowLeft";
import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import { PencilSimpleIcon } from "@phosphor-icons/react/dist/csr/PencilSimple";
import { CrownIcon } from "@phosphor-icons/react/dist/csr/Crown";
import { StarFourIcon } from "@phosphor-icons/react/dist/csr/StarFour";
import { UsersThreeIcon } from "@phosphor-icons/react/dist/csr/UsersThree";
import { SwapIcon } from "@phosphor-icons/react/dist/csr/Swap";
import { ScalesIcon } from "@phosphor-icons/react/dist/csr/Scales";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";

const THEME_ICONS = Object.freeze({
  add: PlusIcon,
  progress: TrendUpIcon,
  journal: NotebookIcon,
  refresh: ArrowClockwiseIcon,
  home: HouseSimpleIcon,
  seasons: ShieldCheckeredIcon,
  houses: CastleTurretIcon,
  inbox: BellRingingIcon,
  analytics: ChartBarIcon,
  pocket: BackpackIcon,
  coach: SparkleIcon,
  rulebook: BookOpenTextIcon,
  points: ChartLineUpIcon,
  help: QuestionIcon,
  admin: GearSixIcon,
  profile: UserCircleIcon,
  more: DotsThreeOutlineIcon,
  signout: SignOutIcon,
  compass: CompassRoseIcon,
  command: ClipboardTextIcon,
  power: LightningIcon,
  standings: RankingIcon,
  trophy: TrophyIcon,
  evidence: SealCheckIcon,
  ticket: TicketIcon,
  back: ArrowLeftIcon,
  info: InfoIcon,
  edit: PencilSimpleIcon,
  crown: CrownIcon,
  star: StarFourIcon,
  roster: UsersThreeIcon,
  swap: SwapIcon,
  balance: ScalesIcon,
  check: CheckCircleIcon,
});

export default function ThemeIcon({
  name,
  size = 20,
  strokeWidth = 2,
  className = "",
}) {
  const Icon = THEME_ICONS[name];

  if (!Icon) {
    return null;
  }

  const weight = strokeWidth >= 2.2 ? "bold" : "regular";

  return (
    <Icon
      className={className}
      size={size}
      weight={weight}
      color="currentColor"
      aria-hidden="true"
      focusable="false"
    />
  );
}
