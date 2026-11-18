export type FortuneCategory =
  | 'Motivación'
  | 'Amor y Amistad'
  | 'Suerte y Éxito'
  | 'Humor Perruno';

export type CategoryFilter = 'Todas' | FortuneCategory;

export interface FortuneItem {
  id: number;
  category: FortuneCategory;
  text: string;
}

export interface DrawnFortune {
  fortune: FortuneItem;
  luckyNumbers: number[];
  drawnAt: string;
}

export const FORTUNE_CATEGORIES: CategoryFilter[] = [
  'Todas',
  'Motivación',
  'Amor y Amistad',
  'Suerte y Éxito',
  'Humor Perruno',
];

const MOTIVACION_PHRASES: string[] = [
  'Cada paso pequeño que das hoy construye la gran alegría de mañana.',
  'Tu constancia brilla más fuerte cuando decides seguir con calma.',
  'Lo que hoy parece un reto difícil pronto será tu mejor anécdota.',
  'Confía en tu ritmo: las flores más bellas no compiten por abrir primero.',
  'Hoy es un día perfecto para empezar eso que tanto ilusiona a tu corazón.',
  'Tu sonrisa tiene el poder de transformar un día gris en pura luz.',
  'No subestimes el valor de intentarlo una vez más con buena energía.',
  'Eres mucho más capaz de lo que tus dudas te dejan ver hoy.',
  'Respira hondo: tienes todo lo necesario para lograrlo paso a paso.',
  'Cuando avanzas con autenticidad, el camino siempre se abre ante ti.',
  'Dedica cinco minutos hoy a celebrar todo lo que ya has superado.',
  'La paciencia y el cariño hacia ti mismo son tus mejores aliados.',
  'Una idea que guardas desde hace tiempo merece ver la luz esta semana.',
  'Incluso las montañas más altas se conquistan disfrutando el paisaje.',
  'Hoy descubrirás una fuerza serena que no sabías que tenías.',
  'Tu creatividad está a punto de regalarte una solución brillante.',
  'No temas cambiar de rumbo si el nuevo camino te hace sentir en paz.',
  'Lo mejor de tu historia aún está esperando ser escrito por ti.',
  'Cada mañana te regala un lienzo limpio para pintar algo bonito.',
  'Hazlo con miedo o con nervios, pero hazlo sabiendo que vas a aprender.',
  'La disciplina suave y constante vence siempre a la prisa.',
  'Hoy es un buen momento para soltar lo que pesa y avanzar ligero.',
  'Tu esfuerzo silencioso de ayer está germinando en silencio hoy.',
  'Cree en esa chispa que se enciende cuando hablas de tus sueños.',
  'Un pequeño cambio en tu rutina traerá una gran renovación de ánimo.',
  'Permítete descansar sin culpa: recargar energía también es avanzar.',
  'Tu amabilidad abre más puertas que cualquier prisa.',
  'Lo que siembras con ilusión siempre encuentra la manera de florecer.',
  'Hoy tienes permiso para brillar sin pedir disculpas ni bajar la voz.',
  'Las metas grandes se vuelven alcanzables cuando las divides en hoy.',
  'Tu intuición te está guiando por el sendero correcto; escúchala.',
  'Agradece lo que tienes hoy y verás multiplicarse lo que deseas.',
  'No compares tu capítulo tres con el capítulo veinte de alguien más.',
  'Cada error pasado fue solo el entrenamiento para tu próximo acierto.',
  'La alegría llega más rápido cuando dejas de postergar tus pequeños gustos.',
  'Hoy una conversación sincera te devolverá la claridad que buscabas.',
  'Tu determinación vale oro: cuídala como tu tesoro más preciado.',
  'A veces dar un paso atrás sirve para tomar el impulso perfecto.',
  'Llevas dentro una luz cálida capaz de inspirar a quienes te rodean.',
  'Hoy elige el progreso real por encima de la perfección imposible.',
  'El entusiasmo que pones en los detalles marca toda la diferencia.',
  'Pronto mirarás atrás y agradecerás no haberte rendido hoy.',
  'Tu mente está lista para encontrar oportunidades donde otros ven muros.',
  'Regálate hoy la misma comprensión que le das a tus seres queridos.',
  'Un nuevo hábito sencillo multiplicará tu bienestar este mes.',
  'La valentía no es no sentir dudas, sino dar el primer paso aun con ellas.',
  'Hoy es un gran día para terminar ese pendiente que te dará alivio.',
  'Confía en el proceso: todo lo bueno toma su tiempo de cocción.',
  'Tu energía positiva contagia ganas de vivir a quienes comparten tu mesa.',
  'Sigue adelante con alegría; el universo aplaude a quien no deja de soñar.',
];

const AMOR_AMISTAD_PHRASES: string[] = [
  'Un abrazo sincero llegará muy pronto para recordarte cuánto importas.',
  'Quien te quiere bien siempre encuentra tiempo, incluso en días ocupados.',
  'Hoy es un día ideal para escribirle a esa persona en la que tanto piensas.',
  'El cariño verdadero se nota en los detalles cotidianos y las risas compartidas.',
  'Una amistad especial se fortalecerá gracias a un momento inesperado.',
  'Quien camina a tu lado con lealtad merece hoy una palabra bonita de tu parte.',
  'El amor que das con generosidad siempre vuelve multiplicado a tu hogar.',
  'Pronto recibirás un mensaje cálido que te sacará una sonrisa inmediata.',
  'La ternura es el idioma universal que todos los corazones entienden.',
  'Compartir una merienda o un café hoy creará un recuerdo inolvidable.',
  'Alguien cercano admira tu forma de cuidar y escuchar a los demás.',
  'Las mejores amistades son como un abrigo tibio en los días de lluvia.',
  'Abre tu corazón sin miedo: mereces relaciones llenas de paz y respeto.',
  'Una mirada cómplice dirá hoy mucho más que mil palabras largas.',
  'El perdón sincero libera espacio para que florezca una nueva etapa de cariño.',
  'Hoy descubrirás que eres el lugar seguro de alguien muy especial.',
  'Celebrar los logros de tus amigos atrae felicidad doble a tu vida.',
  'La persona indicada valora exactamente quién eres, con tus manías incluidas.',
  'Un reencuentro cercano traerá risas, nostalgia bonita y planes nuevos.',
  'No guardes los "te quiero" para después: hoy suenan más bonitos que nunca.',
  'Tu compañía convierte cualquier tarde común en una pequeña fiesta.',
  'El respeto mutuo y el buen humor hacen invencible cualquier vínculo.',
  'Pronto conocerás a alguien cuya energía combinará de maravilla con la tuya.',
  'Un gesto pequeño de gratitud iluminará el corazón de quien te rodea.',
  'La lealtad verdadera no hace ruido, simplemente siempre está ahí.',
  'Hoy es buen momento para escuchar con el corazón antes de responder.',
  'El amor propio es la raíz de la que nacen todas las relaciones sanas.',
  'Una charla nocturna sincera resolverá una duda y acercará corazones.',
  'Quienes te aman de verdad celebran tu alegría como si fuera propia.',
  'Lleva flores, un dulce o una nota amable: hoy harás muy feliz a alguien.',
  'Las risas compartidas hasta que duela la panza son el mejor remedio.',
  'Alguien recuerda con muchísimo cariño una ayuda que le diste sin pensarlo.',
  'La confianza se teje despacio con paciencia, verdad y presencia.',
  'Hoy te sentirás rodeado de afecto genuino y buena compañía.',
  'Cada persona noble en tu vida es un regalo que vale la pena cuidar.',
  'Una sorpresa romántica o tierna está tocando la puerta de esta semana.',
  'Aprender a pedir ayuda también fortalece los lazos con quienes te aman.',
  'Tu calidez humana hace que la gente se sienta bienvenida apenas llega.',
  'El cariño que nace desde la calma dura muchísimo más que cualquier prisa.',
  'Hoy alguien pensará en ti con una sonrisa al recordar un buen momento.',
  'La familia que eliges con el corazón es uno de los mayores tesoros.',
  'Un detalle hecho con tus manos valdrá hoy más que cualquier regalo caro.',
  'El amor crece cuando ambos cuidan el jardín con humor y ternura.',
  'Pronto celebrarás una buena noticia junto a tus personas favoritas.',
  'Decir "gracias por estar" hoy fortalecerá un lazo para toda la vida.',
  'La dulzura con la que tratas al mundo siempre regresa en forma de abrazos.',
  'Las diferencias se vuelven puentes cuando hay voluntad de comprenderse.',
  'Hoy es el día perfecto para planear una salida divertida con tus amigos.',
  'Quien te acepta en tus días tranquilos y en los caóticos vale oro.',
  'Tu corazón merece amor bonito, honesto, alegre y sin complicaciones.',
];

const SUERTE_EXITO_PHRASES: string[] = [
  'Una oportunidad dorada aparecerá cuando menos la estés buscando.',
  'Los números de hoy guardan un guiño especial para tus próximos planes.',
  'El viento sopla a tu favor: atrévete a dar ese sí que venías pensando.',
  'Una buena noticia económica o laboral está más cerca de lo que imaginas.',
  'Tu talento será reconocido en el momento y lugar exactos.',
  'Hoy la fortuna premia a quienes actúan con entusiasmo y corazón limpio.',
  'Un proyecto que parecía lento tomará impulso de forma sorprendente.',
  'Las puertas correctas se abren solas cuando llegas con preparación y sonrisa.',
  'Esta semana recibirás una propuesta interesante que vale la pena escuchar.',
  'Tu buena estrella brilla con fuerza en todo lo que decidas emprender hoy.',
  'Un golpe de suerte agradable resolverá justo eso que te preocupaba.',
  'La abundancia llega con naturalidad a quien sabe compartir y agradecer.',
  'Tu esfuerzo constante está a punto de dar frutos dulces y duraderos.',
  'Hoy es un día excelente para cerrar acuerdos, aprender o lanzar ideas.',
  'La prosperidad comienza con orden, claridad y una actitud optimista.',
  'Alguien influirá positivamente en tu camino abriéndote una nueva puerta.',
  'Confía en ese presentimiento afortunado que tienes sobre tu próximo paso.',
  'Tu habilidad para resolver problemas te destacará muy pronto.',
  'Un hallazgo inesperado —material o de inspiración— te alegrará la jornada.',
  'La buena fortuna acompaña a las mentes curiosas y a los corazones valientes.',
  'Todo se alineará mejor de lo planeado si mantienes la calma ante los cambios.',
  'Una inversión de tiempo en aprender algo nuevo te rendirá grandes frutos.',
  'Hoy recibes luz verde simbólica para avanzar con tu proyecto favorito.',
  'El éxito verdadero se disfruta el doble cuando mantienes los pies en la tierra.',
  'Pronto celebrarás un logro que perseguiste con paciencia durante meses.',
  'La suerte sonríe a quien prepara el terreno mientras otros solo esperan.',
  'Una coincidencia feliz te pondrá frente a la persona o recurso exacto.',
  'Tu reputación de persona confiable atraerá nuevas y mejores oportunidades.',
  'Esta temporada promete estabilidad, crecimiento y muchas satisfacciones.',
  'Un pequeño ahorro o decisión inteligente de hoy te dará gran tranquilidad.',
  'La creatividad combinada con acción rápida será tu fórmula ganadora hoy.',
  'Los obstáculos recientes solo estaban despejando el camino para algo mejor.',
  'Hoy brillas con magnetismo para atraer noticias alegres y proyectos sanos.',
  'Una llamada o correo esperado traerá exactamente la respuesta positiva.',
  'Tu visión a largo plazo demostrará muy pronto que tenías razón.',
  'La prosperidad también se mide en tiempo libre, salud y paz mental.',
  'Un nuevo aprendizaje abrirá una fuente inesperada de ingresos o alegría.',
  'Esta galletita predice una racha de días fluidos donde todo encaja bien.',
  'Acepta los elogios por tu trabajo: te los has ganado con creces.',
  'La fortuna favorece hoy las decisiones tomadas con mente clara y corazón alegre.',
  'Pronto recibirás un regalo o gesto generoso que no esperabas.',
  'Tu constancia convertirá una pequeña idea en un éxito muy querido.',
  'El equilibrio entre trabajo y descanso multiplicará tu productividad esta semana.',
  'Se acerca un cierre de ciclo muy favorable que te dejará satisfecho.',
  'Hoy atraes colaboración positiva: trabajar en equipo te hará imparable.',
  'No descartes esa oportunidad distinta; podría ser tu mayor acierto del año.',
  'La abundancia toca la puerta de quien mantiene viva la gratitud diaria.',
  'Tus manos tienen talento para crear cosas valiosas y duraderas.',
  'Mañana te alegrarás de haber dado hoy el primer paso con decisión.',
  'La buena suerte ya va camino a tu casa, ¡y viene moviendo la colita!',
];

const HUMOR_PERRUNO_PHRASES: string[] = [
  'Chatin opina que tu día mejorará un 200% si te das un gustito dulce ahora.',
  'Bella dice que hoy mereces siesta larga, mantita suave y cero preocupaciones.',
  'Alerta oficial de Chatin y Bella: alguien quiere darte un abrazo (o robarte un snack).',
  'La sabiduría perruna enseña: si no se come ni se juega, déjalo ir moviendo la cola.',
  'Hoy tendrás la misma felicidad que un perrito cuando escucha abrir la bolsa de premios.',
  'Chatin intentó leer tu futuro, pero se distrajo mirando una galleta deliciosa.',
  'Bella predice que hoy recibirás tantos mimos como un cachorro recién bañado.',
  'Consejo milenario de Chatin: inclina la cabeza 15 grados y todo el mundo te dirá que sí.',
  'Si hoy algo sale raro, sacúdete las orejas y sigue caminando con estilo.',
  'Bella confirma que tu aura brilla hoy como plato lleno de croquetas premium.',
  'Hoy es un día perfecto para perseguir tus sueños como Chatin persigue su pelota.',
  'El oráculo canino dicta: menos estrés y más paseos al sol esta tarde.',
  'Chatin y Bella votaron por unanimidad que hoy tienes permiso de repetir postre.',
  'Tu suerte hoy es tan grande como las ganas de Bella de esconder un hueso en el sofá.',
  'Cuando sientas cansancio, haz la pose de panza arriba de Chatin durante diez minutos.',
  'Hoy alguien te mirará con tanta ternura como cuando traes premios en el bolsillo.',
  'Bella asegura que la elegancia empieza por llevar bien puesto tu traje rojo festivo.',
  '¡Guau! Esta galleta contiene 0 calorías y 100% buena vibra aprobada por cachorros.',
  'Chatin te recuerda tomar agua, estirarte y no ladrarle al lunes.',
  'La fortuna dice que hoy encontrarás algo perdido... probablemente debajo del cojín.',
  'Si alguien te pregunta qué haces hoy, responde: "Estoy ocupado siendo adorable".',
  'Bella hizo cuentas con sus patitas y concluyó que mereces un día espectacular.',
  'Hoy tus problemas serán tan chiquitos como las cejitas café de Chatin.',
  'Consejo de guardián: cuida tu alegría con la misma pasión con que cuidas la puerta.',
  'Chatin intentó atrapar una estrella fugaz y terminó trayéndote esta frase bonita.',
  'Hoy brillarás más que la nariz húmeda de un cachorro feliz bajo el sol.',
  'Bella opina que cualquier problema se arregla con una buena rascadita detrás de la oreja.',
  'Pronóstico de hoy: 90% probabilidad de risas y 100% necesidad de apapachos.',
  'Chatin dice que si compartes tu galleta, la suerte se multiplica... ¡sobre todo si le das un trocito!',
  'Hoy caminarás con la confianza de un perrito estrenando correa nueva.',
  'El horóscopo canino señala que tu mejor amigo te espera con ganas de chisme y café.',
  'Bella te desea un día tan cómodo como su camita favorita en invierno.',
  'Regla de oro de Chatin: saluda con entusiasmo a quienes amas cada vez que llegan.',
  'Hoy atraerás miradas bonitas y comentarios amables por tu gran energía.',
  'Si el plan A falla, recuerda que los perritos tienen del plan B al Z para pedir cariño.',
  'Chatin y Bella certifican que eres oficialmente el humano favorito de tu hogar.',
  'Esta galleta crujió tan fuerte que despertó a Bella de su tercer sueñito del día.',
  'Hoy descubrirás que las mejores cosas de la vida no caben en una caja, ¡sino en un abrazo!',
  'Bella sugiere caminar despacio para olfatear todas las cosas buenas del camino.',
  'Tu nivel de ternura hoy supera el límite permitido por la asociación de perritos chibi.',
  'Chatin guardó seis números mágicos especialmente para ti; ¡no los pierdas de vista!',
  'Hoy no persigas a quien no quiere jugar contigo; mejor busca a quien sí tira la pelota.',
  'El secreto de la eterna juventud según Bella: dormir bien, jugar mucho y amar sin filtro.',
  'Chatin levantó una orejita porque presiente que hoy llega una noticia muy divertida.',
  'Que tu semana tenga tantos momentos felices como huellitas dejan Chatin y Bella al correr.',
  'Hoy tu paciencia será premiada con algo todavía más rico que una galleta recién horneada.',
  'Bella movió tanto la cola al abrir esta galleta que casi despega como helicóptero.',
  'Recuerda: para tus perritos, tú ya eres la persona más exitosa y maravillosa del planeta.',
  'Chatin promete vigilarte los sueños hoy para que solo entren ideas bonitas.',
  '¡Guau-tástico! Tu fortuna acaba de recibir el sello oficial de doble patita dorada.',
];

export const ALL_FORTUNES: FortuneItem[] = [
  ...MOTIVACION_PHRASES.map((text, idx) => ({
    id: idx + 1,
    category: 'Motivación' as FortuneCategory,
    text,
  })),
  ...AMOR_AMISTAD_PHRASES.map((text, idx) => ({
    id: idx + 51,
    category: 'Amor y Amistad' as FortuneCategory,
    text,
  })),
  ...SUERTE_EXITO_PHRASES.map((text, idx) => ({
    id: idx + 101,
    category: 'Suerte y Éxito' as FortuneCategory,
    text,
  })),
  ...HUMOR_PERRUNO_PHRASES.map((text, idx) => ({
    id: idx + 151,
    category: 'Humor Perruno' as FortuneCategory,
    text,
  })),
];

export function generateLuckyNumbers(): number[] {
  const nums = new Set<number>();
  while (nums.size < 6) {
    nums.add(Math.floor(Math.random() * 99) + 1);
  }
  return Array.from(nums).sort((a, b) => a - b);
}

export function pickRandomFortune(
  category: CategoryFilter,
  recentIds: number[]
): { fortune: FortuneItem; nextRecentIds: number[] } {
  const pool =
    category === 'Todas'
      ? ALL_FORTUNES
      : ALL_FORTUNES.filter((f) => f.category === category);

  const recentSet = new Set(recentIds);
  let available = pool.filter((f) => !recentSet.has(f.id));

  // If all in this category have been drawn recently, only exclude the immediate last one
  if (available.length === 0) {
    const lastId = recentIds[recentIds.length - 1];
    available = pool.filter((f) => f.id !== lastId);
    if (available.length === 0) available = pool;
    const chosen = available[Math.floor(Math.random() * available.length)];
    return {
      fortune: chosen,
      nextRecentIds: [chosen.id],
    };
  }

  const chosen = available[Math.floor(Math.random() * available.length)];
  return {
    fortune: chosen,
    nextRecentIds: [...recentIds, chosen.id],
  };
}
