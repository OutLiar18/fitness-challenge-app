import INTJEmblem from "../assets/mbti/intj.svg";
import INTPEmblem from "../assets/mbti/intp.svg";
import ENTJEmblem from "../assets/mbti/entj.svg";
import ENTPEmblem from "../assets/mbti/entp.svg";
import INFJEmblem from "../assets/mbti/infj.svg";
import INFPEmblem from "../assets/mbti/infp.svg";
import ENFJEmblem from "../assets/mbti/enfj.svg";
import ENFPEmblem from "../assets/mbti/enfp.svg";
import ISTJEmblem from "../assets/mbti/istj.svg";
import ISFJEmblem from "../assets/mbti/isfj.svg";
import ESTJEmblem from "../assets/mbti/estj.svg";
import ESFJEmblem from "../assets/mbti/esfj.svg";
import ISTPEmblem from "../assets/mbti/istp.svg";
import ISFPEmblem from "../assets/mbti/isfp.svg";
import ESTPEmblem from "../assets/mbti/estp.svg";
import ESFPEmblem from "../assets/mbti/esfp.svg";

export const MBTI_EMBLEMS = Object.freeze({
  INTJ: INTJEmblem,
  INTP: INTPEmblem,
  ENTJ: ENTJEmblem,
  ENTP: ENTPEmblem,
  INFJ: INFJEmblem,
  INFP: INFPEmblem,
  ENFJ: ENFJEmblem,
  ENFP: ENFPEmblem,
  ISTJ: ISTJEmblem,
  ISFJ: ISFJEmblem,
  ESTJ: ESTJEmblem,
  ESFJ: ESFJEmblem,
  ISTP: ISTPEmblem,
  ISFP: ISFPEmblem,
  ESTP: ESTPEmblem,
  ESFP: ESFPEmblem,
});

export function getMbtiEmblem(type) {
  return MBTI_EMBLEMS[String(type ?? "").trim().toUpperCase()] ?? null;
}
