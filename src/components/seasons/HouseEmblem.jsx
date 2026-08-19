import { HorseIcon } from "@phosphor-icons/react/dist/csr/Horse";
import { CrownIcon } from "@phosphor-icons/react/dist/csr/Crown";
import { CatIcon } from "@phosphor-icons/react/dist/csr/Cat";
import { ShieldChevronIcon } from "@phosphor-icons/react/dist/csr/ShieldChevron";
import { TreeIcon } from "@phosphor-icons/react/dist/csr/Tree";
import { CowIcon } from "@phosphor-icons/react/dist/csr/Cow";
import { BirdIcon } from "@phosphor-icons/react/dist/csr/Bird";
import { PawPrintIcon } from "@phosphor-icons/react/dist/csr/PawPrint";
import { FishIcon } from "@phosphor-icons/react/dist/csr/Fish";
import { FlameIcon } from "@phosphor-icons/react/dist/csr/Flame";
import { FireSimpleIcon } from "@phosphor-icons/react/dist/csr/FireSimple";
import { CloudLightningIcon } from "@phosphor-icons/react/dist/csr/CloudLightning";
import { MountainsIcon } from "@phosphor-icons/react/dist/csr/Mountains";
import { ShieldIcon } from "@phosphor-icons/react/dist/csr/Shield";
import { CrownSimpleIcon } from "@phosphor-icons/react/dist/csr/CrownSimple";
import { CompassRoseIcon } from "@phosphor-icons/react/dist/csr/CompassRose";
import { SpiralIcon } from "@phosphor-icons/react/dist/csr/Spiral";
import { TargetIcon } from "@phosphor-icons/react/dist/csr/Target";
import { BugBeetleIcon } from "@phosphor-icons/react/dist/csr/BugBeetle";
import { HandFistIcon } from "@phosphor-icons/react/dist/csr/HandFist";
import { WavesIcon } from "@phosphor-icons/react/dist/csr/Waves";
import { WaveSineIcon } from "@phosphor-icons/react/dist/csr/WaveSine";
import { FireIcon } from "@phosphor-icons/react/dist/csr/Fire";
import { MoonStarsIcon } from "@phosphor-icons/react/dist/csr/MoonStars";
import { PlanetIcon } from "@phosphor-icons/react/dist/csr/Planet";
import { MeteorIcon } from "@phosphor-icons/react/dist/csr/Meteor";
import { RocketLaunchIcon } from "@phosphor-icons/react/dist/csr/RocketLaunch";
import { DiamondIcon } from "@phosphor-icons/react/dist/csr/Diamond";
import { AnchorIcon } from "@phosphor-icons/react/dist/csr/Anchor";
import { SwordIcon } from "@phosphor-icons/react/dist/csr/Sword";
import { TreeEvergreenIcon } from "@phosphor-icons/react/dist/csr/TreeEvergreen";
import { MaskHappyIcon } from "@phosphor-icons/react/dist/csr/MaskHappy";
import { FeatherIcon } from "@phosphor-icons/react/dist/csr/Feather";
import { BinocularsIcon } from "@phosphor-icons/react/dist/csr/Binoculars";
import { DetectiveIcon } from "@phosphor-icons/react/dist/csr/Detective";
import { PiggyBankIcon } from "@phosphor-icons/react/dist/csr/PiggyBank";
import { KnifeIcon } from "@phosphor-icons/react/dist/csr/Knife";
import { BoxingGloveIcon } from "@phosphor-icons/react/dist/csr/BoxingGlove";
import { HurricaneIcon } from "@phosphor-icons/react/dist/csr/Hurricane";
import { MoonIcon } from "@phosphor-icons/react/dist/csr/Moon";
import { ArrowsOutCardinalIcon } from "@phosphor-icons/react/dist/csr/ArrowsOutCardinal";
import { BarbellIcon } from "@phosphor-icons/react/dist/csr/Barbell";
import { BootIcon } from "@phosphor-icons/react/dist/csr/Boot";
import { BugIcon } from "@phosphor-icons/react/dist/csr/Bug";
import { AsclepiusIcon } from "@phosphor-icons/react/dist/csr/Asclepius";
import { AxeIcon } from "@phosphor-icons/react/dist/csr/Axe";
import { HammerIcon } from "@phosphor-icons/react/dist/csr/Hammer";
import { CastleTurretIcon } from "@phosphor-icons/react/dist/csr/CastleTurret";
import { FlowerIcon } from "@phosphor-icons/react/dist/csr/Flower";
import { SunIcon } from "@phosphor-icons/react/dist/csr/Sun";
import { StarFourIcon } from "@phosphor-icons/react/dist/csr/StarFour";
import { SnowflakeIcon } from "@phosphor-icons/react/dist/csr/Snowflake";
import { TornadoIcon } from "@phosphor-icons/react/dist/csr/Tornado";
import { FlowerLotusIcon } from "@phosphor-icons/react/dist/csr/FlowerLotus";
import { SkullIcon } from "@phosphor-icons/react/dist/csr/Skull";
import { PenNibIcon } from "@phosphor-icons/react/dist/csr/PenNib";

const HOUSE_EMBLEM_ICONS = Object.freeze({
  springbok: HorseIcon,
  lion: CrownIcon,
  leopard: CatIcon,
  rhino: ShieldChevronIcon,
  elephant: TreeIcon,
  buffalo: CowIcon,
  eagle: BirdIcon,
  wolf: PawPrintIcon,
  shark: FishIcon,
  phoenix: FlameIcon,
  dragon: FireSimpleIcon,
  storm: CloudLightningIcon,
  mountain: MountainsIcon,
  shield: ShieldIcon,
  crown: CrownSimpleIcon,
  compass: CompassRoseIcon,
  cobra: SpiralIcon,
  tiger: TargetIcon,
  scorpion: BugBeetleIcon,
  bear: HandFistIcon,
  orca: WavesIcon,
  wave: WaveSineIcon,
  volcano: FireIcon,
  moon: MoonStarsIcon,
  planet: PlanetIcon,
  comet: MeteorIcon,
  rocket: RocketLaunchIcon,
  diamond: DiamondIcon,
  anchor: AnchorIcon,
  swords: SwordIcon,
  oak: TreeEvergreenIcon,
  mask: MaskHappyIcon,
  raven: FeatherIcon,
  owl: BinocularsIcon,
  fox: DetectiveIcon,
  boar: PiggyBankIcon,
  crocodile: KnifeIcon,
  gorilla: BoxingGloveIcon,
  kraken: HurricaneIcon,
  bat: MoonIcon,
  ram: ArrowsOutCardinalIcon,
  bull: BarbellIcon,
  stallion: BootIcon,
  spider: BugIcon,
  trident: AsclepiusIcon,
  axe: AxeIcon,
  hammer: HammerIcon,
  castle: CastleTurretIcon,
  fleur: FlowerIcon,
  sun: SunIcon,
  star: StarFourIcon,
  snowflake: SnowflakeIcon,
  tornado: TornadoIcon,
  lotus: FlowerLotusIcon,
  skull: SkullIcon,
  feather: PenNibIcon,
});

export default function HouseEmblem({
  id,
  size = 32,
  strokeWidth = 1.8,
  className = "",
  decorative = true,
  label,
}) {
  const Icon = HOUSE_EMBLEM_ICONS[id] ?? HOUSE_EMBLEM_ICONS.springbok;
  const accessibleLabel = label || id || "House emblem";
  const weight = strokeWidth >= 2.2 ? "fill" : "duotone";

  return (
    <Icon
      className={className}
      size={size}
      weight={weight}
      color="currentColor"
      aria-hidden={decorative ? "true" : undefined}
      aria-label={decorative ? undefined : accessibleLabel}
      role={decorative ? undefined : "img"}
      focusable="false"
    />
  );
}
