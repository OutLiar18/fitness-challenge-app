import springbokImage from "../../assets/house-emblems/springbok.png";
import lionImage from "../../assets/house-emblems/lion.png";
import leopardImage from "../../assets/house-emblems/leopard.png";
import rhinoImage from "../../assets/house-emblems/rhino.png";
import elephantImage from "../../assets/house-emblems/elephant.png";
import buffaloImage from "../../assets/house-emblems/buffalo.png";
import eagleImage from "../../assets/house-emblems/eagle.png";
import wolfImage from "../../assets/house-emblems/wolf.png";
import sharkImage from "../../assets/house-emblems/shark.png";
import phoenixImage from "../../assets/house-emblems/phoenix.png";
import dragonImage from "../../assets/house-emblems/dragon.png";
import stormImage from "../../assets/house-emblems/storm.png";
import mountainImage from "../../assets/house-emblems/mountain.png";
import shieldImage from "../../assets/house-emblems/shield.png";
import crownImage from "../../assets/house-emblems/crown.png";
import compassImage from "../../assets/house-emblems/compass.png";
import cobraImage from "../../assets/house-emblems/cobra.png";
import tigerImage from "../../assets/house-emblems/tiger.png";
import scorpionImage from "../../assets/house-emblems/scorpion.png";
import bearImage from "../../assets/house-emblems/bear.png";
import orcaImage from "../../assets/house-emblems/orca.png";
import waveImage from "../../assets/house-emblems/wave.png";
import volcanoImage from "../../assets/house-emblems/volcano.png";
import moonImage from "../../assets/house-emblems/moon.png";
import planetImage from "../../assets/house-emblems/planet.png";
import cometImage from "../../assets/house-emblems/comet.png";
import rocketImage from "../../assets/house-emblems/rocket.png";
import diamondImage from "../../assets/house-emblems/diamond.png";
import anchorImage from "../../assets/house-emblems/anchor.png";
import swordsImage from "../../assets/house-emblems/swords.png";
import oakImage from "../../assets/house-emblems/oak.png";
import maskImage from "../../assets/house-emblems/mask.png";
import ravenImage from "../../assets/house-emblems/raven.png";
import owlImage from "../../assets/house-emblems/owl.png";
import foxImage from "../../assets/house-emblems/fox.png";
import boarImage from "../../assets/house-emblems/boar.png";
import crocodileImage from "../../assets/house-emblems/crocodile.png";
import gorillaImage from "../../assets/house-emblems/gorilla.png";
import krakenImage from "../../assets/house-emblems/kraken.png";
import batImage from "../../assets/house-emblems/bat.png";
import ramImage from "../../assets/house-emblems/ram.png";
import bullImage from "../../assets/house-emblems/bull.png";
import stallionImage from "../../assets/house-emblems/stallion.png";
import spiderImage from "../../assets/house-emblems/spider.png";
import tridentImage from "../../assets/house-emblems/trident.png";
import axeImage from "../../assets/house-emblems/axe.png";
import hammerImage from "../../assets/house-emblems/hammer.png";
import castleImage from "../../assets/house-emblems/castle.png";
import fleurImage from "../../assets/house-emblems/fleur.png";
import sunImage from "../../assets/house-emblems/sun.png";
import starImage from "../../assets/house-emblems/star.png";
import snowflakeImage from "../../assets/house-emblems/snowflake.png";
import tornadoImage from "../../assets/house-emblems/tornado.png";
import lotusImage from "../../assets/house-emblems/lotus.png";
import skullImage from "../../assets/house-emblems/skull.png";
import featherImage from "../../assets/house-emblems/feather.png";

const HOUSE_EMBLEM_IMAGES = Object.freeze({
  springbok: springbokImage,
  lion: lionImage,
  leopard: leopardImage,
  rhino: rhinoImage,
  elephant: elephantImage,
  buffalo: buffaloImage,
  eagle: eagleImage,
  wolf: wolfImage,
  shark: sharkImage,
  phoenix: phoenixImage,
  dragon: dragonImage,
  storm: stormImage,
  mountain: mountainImage,
  shield: shieldImage,
  crown: crownImage,
  compass: compassImage,
  cobra: cobraImage,
  tiger: tigerImage,
  scorpion: scorpionImage,
  bear: bearImage,
  orca: orcaImage,
  wave: waveImage,
  volcano: volcanoImage,
  moon: moonImage,
  planet: planetImage,
  comet: cometImage,
  rocket: rocketImage,
  diamond: diamondImage,
  anchor: anchorImage,
  swords: swordsImage,
  oak: oakImage,
  mask: maskImage,
  raven: ravenImage,
  owl: owlImage,
  fox: foxImage,
  boar: boarImage,
  crocodile: crocodileImage,
  gorilla: gorillaImage,
  kraken: krakenImage,
  bat: batImage,
  ram: ramImage,
  bull: bullImage,
  stallion: stallionImage,
  spider: spiderImage,
  trident: tridentImage,
  axe: axeImage,
  hammer: hammerImage,
  castle: castleImage,
  fleur: fleurImage,
  sun: sunImage,
  star: starImage,
  snowflake: snowflakeImage,
  tornado: tornadoImage,
  lotus: lotusImage,
  skull: skullImage,
  feather: featherImage,
});

export default function HouseEmblem({
  id,
  size = 32,
  className = "",
  decorative = true,
  label,
}) {
  const src = HOUSE_EMBLEM_IMAGES[id] ?? HOUSE_EMBLEM_IMAGES.springbok;
  const accessibleLabel = label || id || "House emblem";

  return (
    <img
      className={className}
      src={src}
      width={size}
      height={size}
      alt={decorative ? "" : accessibleLabel}
      aria-hidden={decorative ? "true" : undefined}
      draggable="false"
      decoding="async"
      loading="lazy"
    />
  );
}
