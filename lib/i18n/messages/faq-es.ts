export const faqEs = {
  title: 'FAQ',
  subtitle: 'Las preguntas que más recibe nuestro equipo de soporte.',
  seeAll: 'Ver todas las FAQs',
  backHome: '← Inicio',
  pageTitle: 'Preguntas frecuentes',
  pageSubtitle:
    'Facturación, registro de comidas, entrenamientos, sincronización con Health y solución de problemas.',
  contactTitle: '¿Sigues atascado?',
  contactBody:
    'Escríbenos a support@ignitehub.app o envía un mensaje mediante el formulario de contacto. Solemos responder en 1-2 días hábiles.',
  contactLink: 'Contáctanos',
  teaser: [
    {
      q: '¿Por qué sigo viendo un paywall después de pagar?',
      a: 'Las suscripciones las gestionan Apple o Google, no nosotros directamente. Abre la app con la misma cuenta de App Store o Google Play con la que compraste e intenta Restore Purchases en Ajustes. Si sigue fallando, escribe a support@ignitehub.app con el recibo de la tienda.',
    },
    {
      q: '¿Cómo cancelo mi suscripción o periodo de prueba?',
      a: 'Cancela cuando quieras en los ajustes de la tienda de tu dispositivo. En iPhone: Ajustes → [Tu nombre] → Suscripciones → IGNITE AI → Cancelar. En Android: Google Play → Pagos y suscripciones → Suscripciones → IGNITE AI → Cancelar. Cancela antes de que termine la prueba o la renovación para evitar el siguiente cargo.',
    },
    {
      q: 'Quiero un reembolso. ¿Cómo lo solicito?',
      a: 'Los reembolsos dependen de dónde compraste la suscripción:',
      bullets: [
        'Apple App Store: Apple lo gestiona directamente.',
        'Google Play: Lo mismo, solicítalo a través de Google.',
        '¿Necesitas ayuda para encontrar la página correcta? Escribe a support@ignitehub.app.',
      ],
      links: [
        {
          label: 'Solicitar un reembolso en Apple',
          href: 'https://support.apple.com/118223',
        },
        {
          label: 'Solicitar tu reembolso en Google Play',
          href: 'https://support.google.com/googleplay/answer/2479637',
        },
      ],
    },
    {
      q: 'La IA escaneó mal mi comida. ¿Qué hago?',
      a: 'Tras el análisis de la comida, ábrela desde Recently uploaded, ajústala con las opciones disponibles y guarda los cambios.',
    },
    {
      q: 'La app se cierra o no abre. ¿Qué pruebo?',
      a: 'Cierra la app por completo, reinicia el teléfono y asegúrate de tener la última versión en App Store / Play Store. Si sigue fallando, cuéntanos el modelo del dispositivo, la versión del sistema y más o menos cuándo ocurre en support@ignitehub.app para que podamos investigarlo.',
    },
    {
      q: 'Mis pasos o los datos de Apple Health / Health Connect no aparecen.',
      a: 'Confirma que los permisos de salud están activos para IGNITE AI (Apple Health en iOS, Health Connect en Android), que las apps de origen sincronizan y que has permitido pasos/actividad. Abre IGNITE AI una vez tras conceder el acceso para que se ejecute una sincronización. Si los números siguen bloqueados, revoca y vuelve a conceder los permisos y reabre la app.',
    },
  ],
  categories: [
    {
      title: 'Suscripciones y facturación',
      items: [
        {
          q: '¿Por qué sigo viendo un paywall después de pagar?',
          a: 'Las suscripciones las gestionan Apple o Google, no nosotros directamente. Abre la app con la misma cuenta de App Store o Google Play con la que compraste e intenta Restore Purchases en Ajustes. Si sigue fallando, escribe a support@ignitehub.app con el recibo de la tienda.',
        },
        {
          q: '¿Cómo cancelo mi suscripción o periodo de prueba?',
          a: 'Cancela cuando quieras en los ajustes de la tienda de tu dispositivo. En iPhone: Ajustes → [Tu nombre] → Suscripciones → IGNITE AI → Cancelar. En Android: Google Play → Pagos y suscripciones → Suscripciones → IGNITE AI → Cancelar. Cancela antes de que termine la prueba o la renovación para evitar el siguiente cargo.',
        },
        {
          q: 'Quiero un reembolso. ¿Cómo lo solicito?',
          a: 'Los reembolsos dependen de dónde compraste la suscripción:',
          bullets: [
            'Apple App Store: Apple lo gestiona directamente.',
            'Google Play: Lo mismo, solicítalo a través de Google.',
            '¿Necesitas ayuda para encontrar la página correcta? Escribe a support@ignitehub.app.',
          ],
          links: [
            {
              label: 'Solicitar un reembolso en Apple',
              href: 'https://support.apple.com/118223',
            },
            {
              label: 'Solicitar tu reembolso en Google Play',
              href: 'https://support.google.com/googleplay/answer/2479637',
            },
          ],
        },
        {
          q: '¿Me volverán a cobrar después del periodo de prueba?',
          a: 'Sí, si no cancelas antes de que termine la prueba, la suscripción se renueva automáticamente al precio del plan mostrado al registrarte. Recibirás avisos de la tienda según las normas de Apple/Google. Gestiona o cancela cuando quieras en las suscripciones de la tienda.',
        },
        {
          q: 'Me suscribí en iPhone pero uso Android (o al revés).',
          a: 'Las suscripciones de la tienda no se transfieren entre Apple y Google. Necesitarás una suscripción activa en la tienda del dispositivo que uses, o contacta con soporte si estás cambiando de plataforma y necesitas ayuda.',
        },
      ],
    },
    {
      title: 'Registro de comidas e IA',
      items: [
        {
          q: 'La IA escaneó mal mi comida. ¿Qué hago?',
          a: 'Tras el análisis de la comida, ábrela desde Recently uploaded, ajústala con las opciones disponibles y guarda los cambios.',
        },
        {
          q: '¿Qué precisión tienen las estimaciones de calorías y macros?',
          a: 'IGNITE AI está diseñado para ser el mejor del mercado identificando ingredientes de forma visual. Los macros corresponden al peso de cada ingrediente, y ese peso es una estimación aproximada. Siempre que puedas, ajusta el peso a la cantidad real si pesas la comida.',
        },
        {
          q: '¿Puedo registrar sin hacer una foto?',
          a: 'Sí. En Quick log puedes escribir una descripción, usar la voz o escanear un código de barras o etiqueta nutricional. La foto es opcional.',
        },
        {
          q: '¿Puedo cambiar una comida después de guardarla?',
          a: 'Sí. Abre la comida registrada y edita alimentos, porciones o totales. Los cambios actualizan tus calorías y macros del día.',
        },
        {
          q: '¿Puedo guardar una comida para registrarla más tarde?',
          a: 'Sí. Abre una comida registrada y pulsa el icono de guardar. Aparecerá en Diet → Saved. Cuando quieras la misma comida otra vez, ve allí y pulsa Log. No hace falta hacer una foto cada vez que comes lo mismo.',
        },
      ],
    },
    {
      title: 'Entrenamientos',
      items: [
        {
          q: '¿Cómo registro un entrenamiento?',
          a: 'En la pantalla principal, pulsa el botón "+" y elige Log workout. Verás varias opciones. Elige la que mejor se adapte a ti. Los entrenamientos se guardan y estiman las calorías quemadas según tu perfil.',
        },
        {
          q: '¿Los entrenamientos ajustan mi objetivo calórico automáticamente?',
          a: 'La actividad que registras (y los datos elegibles sincronizados desde Health) ayudan a contextualizar tu progreso. Toma los objetivos calóricos como orientación. Ajusta los objetivos en ajustes si cambia tu carga de entrenamiento.',
        },
        {
          q: '¿Puedo editar o eliminar un entrenamiento?',
          a: 'Sí. Abre la sesión desde tu historial y edítala o elimínala para que tus estadísticas sigan siendo precisas.',
        },
      ],
    },
    {
      title: 'Apple Health y Health Connect',
      items: [
        {
          q: 'Mis pasos o datos de salud no aparecen.',
          a: 'Confirma que los permisos de salud están activos para IGNITE AI (Apple Health en iOS, Health Connect en Android), que las apps de origen sincronizan y que has permitido pasos/actividad. Abre IGNITE AI una vez tras conceder el acceso para que se ejecute una sincronización. Si los números siguen bloqueados, revoca y vuelve a conceder los permisos y reabre la app.',
        },
        {
          q: '¿Qué datos lee IGNITE AI?',
          a: 'Con tu permiso, IGNITE AI puede leer los datos siguientes. Tú controlas las categorías en Apple Health o Health Connect y puedes revocar el acceso cuando quieras en los ajustes del sistema.',
          bullets: [
            'Pasos',
            'Frecuencia cardíaca media',
            'Oxígeno en sangre',
            'Sueño (incluidas las fases del sueño)',
          ],
        },
        {
          q: '¿Por qué los números no coinciden con mi reloj o la app Salud?',
          a: 'Las fuentes pueden diferir (teléfono frente a reloj) y la sincronización no siempre es instantánea. Comprueba qué app es la fuente principal en Health / Health Connect y luego desliza para actualizar o reabre IGNITE AI.',
        },
      ],
    },
    {
      title: 'Coach, amigos y compartir',
      items: [
        {
          q: '¿Cómo funcionan Amigos o la compartición en grupo?',
          a: 'Invita a personas desde el área de Amigos con tu flujo de invitación. Una vez conectados, puedes compartir comidas, entrenamientos o logros según lo que elijas publicar. Tú controlas qué es visible.',
        },
        {
          q: '¿Qué son Share Cards?',
          a: 'Share Cards son instantáneas con estilo de comidas, rachas o logros que puedes enviar a amigos o publicar en redes. Elige un tema, genera la tarjeta y comparte desde el menú de tu dispositivo.',
        },
        {
          q: '¿Puedo dejar de compartir con alguien?',
          a: 'Sí. Elimínalo de tu lista de amigos/grupo o abandona el grupo compartido en los ajustes de Amigos para que las publicaciones futuras no se compartan con esa persona.',
        },
      ],
    },
    {
      title: 'Problemas de la app',
      items: [
        {
          q: 'La app se cierra o no abre. ¿Qué pruebo?',
          a: 'Cierra la app por completo, reinicia el teléfono y asegúrate de tener la última versión en App Store / Play Store. Si sigue fallando, cuéntanos el modelo del dispositivo, la versión del sistema y más o menos cuándo ocurre en support@ignitehub.app para que podamos investigarlo.',
        },
        {
          q: 'Problemas de inicio de sesión o de cuenta',
          a: 'Confirma que usas el mismo método de inicio de sesión de antes (Apple, Google o email). Si no llega un código o enlace, revisa spam y espera un minuto antes de solicitar otro. ¿Sigues bloqueado? Escribe a support@ignitehub.app desde la dirección de la cuenta.',
        },
        {
          q: 'No llegan las notificaciones',
          a: 'Activa las notificaciones de IGNITE AI en los Ajustes del sistema y revisa los recordatorios dentro de la app. El modo de bajo consumo o los ahorradores de batería pueden retrasar alertas en algunos teléfonos.',
        },
      ],
    },
  ],
} as const
