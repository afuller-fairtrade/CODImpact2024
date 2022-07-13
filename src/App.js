import { useCallback } from "react";

import "survey-core/defaultV2.min.css";
// import 'survey-core/survey.min.css';
import { StylesManager, Model, FunctionFactory } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/survey.i18n.js";
import ProductTree from "./ProductTree";

StylesManager.applyTheme("defaultV2");

FunctionFactory.Instance.register("screenValue", screenValue);

function onAfterRenderQuestion(survey, options) {
  if (options.question.name === "major_product_category") {
    ProductTree.loadMajorCategories(options.question);
  }
}

function onDynamicPanelItemValueChanged(survey, options) {
  console.dir(options);
  switch (options.name) {
    case "major_product_category":
      ProductTree.filterMinorCategories(
        options.panel.getQuestionByName("minor_product_category"),
        options.value
      );
      options.panel.getQuestionByName("minor_product_category").value = null;
      break;
    case "minor_product_category":
      ProductTree.filterProductionTypes(
        options.panel.getQuestionByName("product_form_name"),
        options.value,
        options.panel.getQuestionByName("major_product_category").value
      );
      options.panel.getQuestionByName("product_form_name").value = null;
      break;
    default:
      break;
  }
}

const surveyJson = {
  version: 1,
  locale: "en",
  logoPosition: "right",
  focusOnFirstError: false,
  progressBarType: "buttons",
  showProgressBar: "top",
  title: {
    default: "FairInsight Survey on Use and Information Management",
    es: "Encuesta de Fairtrade sobre el uso y la gestión de la información",
    fr: "Enquête FairInsight sur l'utilisation et la gestion des informations",
    pt: "Pesquisa FairInsight sobre uso e gerenciamento de informações"
   },
  description: {
    default: "This survey will take about 20 to 30 minutes to complete and asks about some of Fairtrade's key indicators, such as production and land area of Fairtrade certified products, members of your organization and workers employed by your organization. You will also have an opportunity to share your feedback about the survey and any challenges your organization faces on managing and sharing information with Fairtrade.",
    es: "Esta encuesta tardará de 20 a 30 minutos y hace preguntas sobre algunos de los indicadores clave de Fairtrade, tales como producción y área de tierra de productos certificados de Fairtrade, miembros(as) de su organización y trabajadores(as) empleados(as) por la misma. También tendrá la oportunidad de compartir sus comentarios acerca de la encuesta y cualesquiera retos que enfrente su organización al administrar y compartir información con Fairtrade.",
    fr: "Cette enquête ne prendra que 20 à 30 minutes et qu’elle portera sur certains des indicateurs clés de Fairtrade, comme la production et la superficie des terres des produits certifiés Fairtrade, les membres et les travailleurs employés de votre organisation. Vous aurez également l'occasion de nous faire part de vos commentaires sur l'enquête et des défis que votre organisation doit relever pour gérer et partager les informations avec Fairtrade.",
    pt: "Esta pesquisa levará apenas 20-30 minutos e perguntamos sobre alguns dos indicadores-chave do Fairtrade, tais como produção e extensão de terra de produtos certificados pelo Fairtrade, membros de sua organização e trabalhadores(as) empregados(as) por sua organização. Você também terá a oportunidade de compartilhar seus comentários sobre a pesquisa e quaisquer desafios que sua organização enfrente em relação à gestão e compartilhamento de informações com o Fairtrade."
   },
  showPreviewBeforeComplete: "showAnsweredQuestions",
  checkErrorsMode: "onValueChanged",
    pages: [
     {
      name: "Start page",
      elements: [
       {
        type: "panel",
        name: "hidden_fields_panel",
        elements: [
         {
          type: "text",
          name: "floid",
          title: "Fairtrade ID (FLOID):",
          validators: [
           {
            type: "numeric",
            text: {
             default: "Please enter a valid number.",
             es: "Ingrese un número válido.",
             fr: "Veuillez entrer un nombre valide.",
             pt: "Por favor, digite um número válido."
            }
           }
          ]
         },
         {
          type: "text",
          name: "org_name",
          title: "Name of the organization:"
         },
         {
          type: "radiogroup",
          name: "producer_setup",
          title: "Choose your producer setup:",
          choices: [
           {
            value: "spo",
            text: "Small-scale producer organization or Contract production"
           },
           {
            value: "hl",
            text: "Hired labor plantation"
           }
          ]
         },
         {
          type: "radiogroup",
          name: "survey_language",
          title: "Choose the language of the survey:",
          defaultValue: "en",
          choices: [
           {
            value: "en",
            text: "English"
           },
           {
            value: "es",
            text: "Spanish"
           },
           {
            value: "pt",
            text: "Portuguese"
           },
           {
            value: "fr",
            text: "French"
           }
          ]
         }
        ],
        title: "This panel will be pre-populated and hidden from the PO (hence not translated)"
       },
       {
        type: "panel",
        name: "consent_form_text",
        elements: [
         {
          type: "html",
          name: "info_box_placeholder",
          html: {
           default: "<br>Fairtrade is a voluntary certification system which aims to have positive impacts on farmer organisations like yours through the certification of your certified product.<br><br>Our goal is to make FairInsight a single place for producer organizations to manage your information and possibly share with Fairtrade. Over the next few years, FairInsight will replace other data collection tools (such as the CODImpact questionnaire conducted during audits).<br><br>Through this questionnaire Fairtrade is collecting data from members of certified organizations to better understand any challenges in reporting and the quality of data being reported. Your participation is very important for the surveyâ€™s success. Your contribution will be identifiable to us so that we can follow up on untangling specific issues or challenges that you may face while reporting.<br><br>While the survey is completely voluntary, your participation will help us better understand how to make the FairInsight platform easy to use and beneficial to you. The collected data will be treated as confidential by the Fairtrade system and we would only be using this for internal quality assessments that may inform the further development of FairInsight. No personal or sensitive information will be shared outside of Fairtrade International and the Producer Networks.",
           es: "<br>Fairtrade es un sistema de certificación voluntaria que busca tener impactos positivos en las organizaciones de agricultores(as) como la suya a través de la certificación de su producto certificado.<br><br>Nuestra meta es hacer que FairInsight sea un lugar único para que las organizaciones productoras administren información y posiblemente la compartan con Fairtrade. En los años venideros, FairInsight reemplazará otras herramientas de recolección de datos (como el cuestionario CODImpact que se conduce durante las auditorías).<br><br>A través de este cuestionario, Fairtrade recolecta datos de los miembros de las organizaciones certificadas para comprender mejor cualesquiera retos para reportar y la calidad de los datos que se reportan. Su participación es muy importante para el éxito de la encuesta. Su contribución será identificable para nosotros para que podamos dar seguimiento con respecto a explicar cuestiones o retos en específico que pueda enfrentar mientras reporta.<br><br>Aunque es voluntario participar, si lo hace nos ayudará a comprender mejor cómo hacer que FairInsight sea más fácil de usar y beneficiosa para usted. Fairtrade tratará con confidencialidad los datos recolectados en su sistema y solo usaremos esto para evaluaciones de calidad interna que puedan tener información para desarrollar más FairInsight. No se compartirá información personal ni sensible fuera de Fairtrade International y las Redes productoras.",
           fr: "<br>Fairtrade est un système de certification volontaire dont l’objectif est d’avoir des impacts positifs sur les organisations d'agriculteurs comme la vôtre grâce à la certification de votre produit certifié.<br><br>Notre objectif est de faire de FairInsight un lieu unique pour les organisations de producteurs afin de gérer vos informations et éventuellement de les partager avec Fairtrade. Au cours des années qui viennent, FairInsight remplacera d'autres outils de collecte de données (tels que le questionnaire CODImpact réalisé lors des audits).<br><br>Par le biais de ce questionnaire, Fairtrade collecte des données auprès des membres des organisations certifiées afin de mieux comprendre les défis liés aux rapports et à la qualité des données transmises. Votre participation est très importante pour le succès de l’enquête. Nous serons en mesure d’identifier votre contribution afin d’assurer le suivi des questions ou des défis spécifiques que vous pourriez rencontrer lors de la création de vos rapports.<br><br>Bien que l’enquête soit entièrement volontaire, votre participation nous aidera à mieux comprendre comment rendre la plateforme FairInsight facile à utiliser et bénéfique pour vous. Les données collectées seront traitées de façon confidentielle par le système Fairtrade et nous ne les utiliserons qu’à des fins d’évaluations de qualité internes visant à éclairer le développement ultérieur de FairInsight. Aucune information personnelle ou sensible ne sera partagée en dehors de Fairtrade International et des réseaux de producteurs.",
           pt: "<br>Fairtrade é um sistema voluntário de certificações que visa ter impactos positivos em organizações de agricultores(as) através da certificação de seu produto certificado.<br><br>Nosso objetivo é fazer da FairInsight um local único para que as organizações de produtores gerenciem suas informações e possivelmente compartilhem com o Fairtrade. Nos próximos anos, o FairInsight substituirá outras ferramentas de coleta de dados (como o questionário CODImpact realizado durante as auditorias).<br><br>Por meio deste questionário, o Fairtrade está coletando dados de membros de organizações certificadas para compreender melhor quaisquer desafios nos relatórios e a qualidade dos dados que estão sendo relatados. Sua participação é muito importante para o sucesso da pesquisa. Sua contribuição será identificável para que possamos acompanhar a resolução de questões ou desafios específicos que você possa ter que enfrentar durante a elaboração do relatório.<br><br>Embora a pesquisa seja totalmente voluntária, sua participação nos ajudará a entender melhor como tornar a plataforma FairInsight fácil de usar e útil para você. Os dados coletados serão tratados como confidenciais pelo sistema Fairtrade e só os utilizaremos para avaliações internas de qualidade que informem o desenvolvimento futuro da FairInsight. Não serão compartilhadas informações pessoais ou sensíveis fora da Fairtrade International e das Redes de Produtores."
          }
         },
         {
          type: "radiogroup",
          name: "consent_to_participate",
          title: {
           default: "Are you willing to take part in this survey for internal learning and improvement?",
           es: "¿Desea participar en esta encuesta de aprendizaje y mejoría de uso interno?",
           fr: "Êtes-vous prêt(e) à participer à cette enquête destinée à l’apprentissage et aux améliorations en interne ?",
           pt: "Você está disposto a participar desta pesquisa para aprendizado e melhoria interna?"
          },
          hideNumber: true,
          defaultValue: "consent",
          isRequired: true,
          choices: [
           {
            value: "consent",
            text: {
             default: "Yes, I consent to sharing my information and feedback asked in this survey with Fairtrade",
             es: "Sí, doy mi consentimiento de compartir mi información y comentarios que se piden en esta encuesta con Fairtrade",
             fr: "Oui, je consens à partager avec Fairtrade les informations et les commentaires collectés dans cette enquête avec Fairtrade",
             pt: "Sim, eu concordo em compartilhar minhas informações e feedback solicitados nesta pesquisa com a Fairtrade."
            }
           },
           {
            value: "no_consent",
            text: {
             default: "No, I do not consent to sharing my information and feedback asked in this survey with Fairtrade",
             es: "No, no doy mi consentimiento de compartir mi información y comentarios que se piden en esta encuesta con Fairtrade",
             fr: "Non, je ne consens pas à partager avec Fairtrade les informations et les commentaires collectés dans cette enquête avec Fairtrade",
             pt: "Não, eu não concordo em compartilhar minhas informações e feedback solicitados nesta pesquisa com a Fairtrade."
            }
           }
          ]
         }
        ]
       },
       {
        type: "panel",
        name: "organic_logic_panel",
        elements: [
         {
          type: "html",
          name: "info_box_in_transition_to_organic",
          html: {
           default: "<br><i>Note: For the purposes of this survey, please consider members, land area and production that are in transition from conventional to organic, as conventional</i>",
           es: "<br><i>Nota: para efectos de este encuesta, tenga en cuenta a los miembros, el área de la tierra y la producción que se encuentran en transición de lo convencional a lo orgánico como lo que es convencional</i>",
           fr: "<br><i>Remarque : Pour les besoins de cette enquête, veuillez considérer les membres, la superficie des terres et la production qui sont en transition de conventionnels à biologiques, comme conventionnels</i>",
           pt: "<br><i>Observação: Para os propósitos desta pesquisa, considere membros, área de terra e produção que estão em transição de convencional para orgânico, como convencional</i>"
          }
         },
         {
          type: "radiogroup",
          name: "organic_logic",
          title: {
           default: "For the last production cycle (2021-2022), was some or all of your production of Fairtrade crops also produced under an organic certification?",
           es: "Para el último ciclo de producción (2021-2022), ¿una parte o la totalidad de su producción de cosechas de Fairtrade se produjeron también bajo una certificación orgánica?",
           fr: "Pour le dernier cycle de production (2021-2022), est-ce que toute ou une partie de votre production de cultures Fairtrade a également été produite sous la certification biologique ?",
           pt: "Para o último ciclo de produção (2021-2022), alguma ou toda a sua produção das plantações Fairtrade também foi produzida sob uma certificação orgânica?"
          },
          hideNumber: true,
          defaultValue: "mixed",
          isRequired: true,
          choices: [
           {
            value: "mixed",
            text: {
             default: "Yes, some production was organic and some was conventional",
             es: "Sí, parte de la producción fue orgánica y parte fue convencional",
             fr: "Oui, certaines productions étaient biologiques et d'autres étaient conventionnelles",
             pt: "Sim, algumas produções eram orgânicas e outras eram convencionais."
            }
           },
           {
            value: "organic_only",
            text: {
             default: "Yes, all production was organic",
             es: "Sí, toda la producción fue orgánica",
             fr: "Oui, toute la production était biologique",
             pt: "Sim, toda a produção era orgânica"
            }
           },
           {
            value: "conventional_only",
            text: {
             default: "No, all production was either conventional or in transition to organic",
             es: "No, toda la producción fue convencional o en transición a orgánica",
             fr: "Non, toute la production était conventionnelle ou en phase de transition vers biologique",
             pt: "Não, toda a produção era convencional ou em transição para a orgânica."
            }
           }
          ]
         }
        ],
        visibleIf: "{consent_to_participate} = 'consent'"
       }
      ],
      title: {
       default: "Welcome to the FairInsight Survey on Use and Information Management!",
       es: "¡Bienvenido a la Encuesta de Fairtrade sobre el uso y la gestión de la información!",
       fr: "Nous vous souhaitons la bienvenue dans l'enquête FairInsight sur l'utilisation et la gestion des informations !",
       pt: "Bem-vindo à Pesquisa FairInsight sobre Uso e Gerenciamento de Informações!"
      },
      navigationTitle: {
       default: "Start page",
       es: "Página de inicio",
       fr: "Page de démarrage",
       pt: "Página inicial"
      }
     },
     {
      name: "Members",
      elements: [
       {
        type: "panel",
        name: "instructions_farmers",
        elements: [
         {
          type: "html",
          name: "info_box_farmers_workers",
          html: {
           default: "<br>One of the most important pieces of information that Fairtrade stakeholders and consumers are interested in is how many male and female farmers and workers are part of the global Fairtrade community and benefit from Fairtrade certification. This helps Fairtrade understand and communicate our reach, analyse trends over time, and guide our global strategy.",
           es: "<br>Una de las piezas más importantes de información que interesa a los interesados de Fairtrade y los consumidores es cuántos agricultores(as) y trabajadores(as), tanto hombres como mujeres, forman parte de la comunidad mundial de Fairtrade y se benefician de la certificación Fairtrade. Esto ayuda a que Fairtrade entienda y comunique nuestro alcance, analice tendencias con el tiempo y guíe nuestra estrategia mundial.",
           fr: "<br>L'une des informations les plus importantes qui intéressent les parties prenantes et les consommateurs du commerce équitable est le nombre d'agriculteurs/rices et de travailleurs/euses faisant partie de la communauté mondiale Fairtrade et bénéficiant de la certification Fairtrade. Cela aide Fairtrade à comprendre et à communiquer notre portée, à analyser les tendances au fil du temps et à guider notre stratégie mondiale.",
           pt: "<br>Uma das informações mais importantes nas quais as partes interessadas e os consumidores do Fairtrade querem saber quantos homens e mulheres fazendeiros(as) e trabalhadores(as) fazem parte da comunidade global do Fairtrade e se beneficiam da certificação do Fairtrade. Isto ajuda o Fairtrade a entender e comunicar nosso alcance, analisar tendências ao longo do tempo e orientar nossa estratégia global."
          }
         },
         {
          type: "html",
          name: "info_box_numberfarmers",
          html: {
           default: "<br><b>Instructions:</b><hr>In this section, please enter the number of farmers that are members of your organization. Please also enter the number of women and men in your organization, if this information is known.<br><br><i>Count each member of your organization only once. If some members are in the process of transitioning from conventional to organic production, please count them as conventional farmers.</i>",
           es: "<br><b>Instrucciones:</b><hr>ingrese el número de agricultores(as) que son miembros de su organización en esta sección. También ingrese el número de mujeres y hombres en su organización si se conoce esta información.<br><br><i>Cuente a cada miembro de su organización solo una vez. Si algunos miembros de su organización se encuentran en el proceso de hacer su transición de convencional a orgánica, cuéntelos como agricultores(as) convencionales.</i>",
           fr: "<br><b>Instructions :</b><hr>Dans cette section, veuillez indiquer le nombre d'agriculteurs/rices membres de votre organisation. Veuillez également indiquer le nombre de femmes et d'hommes dans votre organisation, si cette information est connue.<br><br><i>Compter chaque membre de votre organisation une seule fois. Si certains membres sont en phase de transition de la production conventionnelle à la production biologique, veuillez les compter comme agriculteurs/rices conventionnels/elles.</i>",
           pt: "<br><b>Instruções:</b><hr>Nesta seção, favor informar o número de fazendeiros(as) que são membros de sua organização. Por favor, digite também o número de mulheres e homens em sua organização, se esta informação for conhecida.<br><br><i>Conte cada membro de sua organização apenas uma vez. Se alguns membros estão em processo de transição da produção convencional para a orgânica, por favor, considere-os como fazendeiros(as) convencionais.</i>"
          }
         }
        ]
       },
       {
        type: "panel",
        name: "Number of farmers",
        elements: [
         {
          type: "panel",
          name: "farmers_conventional_panel",
          elements: [
           {
            type: "text",
            name: "farmers_conventional_total",
            title: {
             default: "Total farmers:",
             es: "Agricultores(as) totales:",
             fr: "Total des agriculteurs/rices :",
             pt: "Total de fazendeiros(as):"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             },
             {
              type: "expression",
              text: {
               default: "The sum of male and female conventional farmers is greater than the total. Please correct the error.",
               es: "La suma de los agricultores convencionales(as), tanto hombres como mujeres, es mayor que el total. Corrija este error.",
               fr: "La somme des agriculteurs/rices conventionnels/elles est supérieure au total. Veuillez corriger l'erreur.",
               pt: "A soma de homens e mulheres fazendeiros(as) convencionais é maior do que o total. Por favor, corrija o erro."
              },
              expression: "{farmers_conventional_total} >= {farmers_conventional_female}+{farmers_conventional_male} OR {farmers_conventional_total} empty"
             }
            ]
           },
           {
            type: "text",
            name: "farmers_conventional_female",
            visibleIf: "{farmers_conventional_gender_not_known} empty",
            title: {
             default: "Number of female farmers:",
             es: "Número de agricultoras:",
             fr: "Nombre d'agricultrices:",
             pt: "Número de fazendeiros femininos:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "text",
            name: "farmers_conventional_male",
            visibleIf: "{farmers_conventional_gender_not_known} empty",
            startWithNewLine: false,
            title: {
             default: "Number of male farmers:",
             es: "Número de agricultores hombres:",
             fr: "Nombre d'agriculteurs:",
             pt: "Número de fazendeiros masculinos:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "html",
            name: "warning_conventional_farmers_sum",
            visibleIf: "{farmers_conventional_total} > {farmers_conventional_female}+{farmers_conventional_male} AND {farmers_conventional_female} notempty AND {farmers_conventional_male} notempty",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of male and female conventional farmers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de agricultores y agricultoras convencionales es menor que el total. Revise nuevamente que los números reportados sean correctos antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des agriculteurs/rices conventionnels/elles est inférieure au total. Veuillez vérifier que les chiffres rapportés sont corrects avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3>\n<span style=\"font-size: medium;\">A soma de homens e mulheres fazendeiros convencionais é menor do que o total. Favor verificar duas vezes se os números informados estão corretos antes de seguir em frente.</span>\n</div>"
            }
           },
           {
            type: "checkbox",
            name: "farmers_conventional_gender_not_known",
            titleLocation: "hidden",
            hideNumber: true,
            choices: [
             {
              value: "not_known",
              text: {
               default: "Please check here if you do not know the number of conventional farmers by gender",
               es: "Ponga una marca aquí si no conoce el número de agricultores(as) convencionales por género",
               fr: "Veuillez vérifier ici si vous ne connaissez pas le nombre d'agriculteurs/rices conventionnels/elles (par sexe)",
               pt: "Favor verificar aqui se você não sabe o número de fazendeiros(as) convencionais por gênero"
              }
             }
            ]
           }
          ],
          visibleIf: "{organic_logic} anyof ['mixed', 'conventional_only']",
          title: {
           default: "Conventional Farmers",
           es: "Agricultores(as) convencionales",
           fr: "Agriculteurs/rices conventionnels/elles",
           pt: "Fazendeiros(as) Convencionais"
          }
         },
         {
          type: "panel",
          name: "farmers_organic_panel",
          elements: [
           {
            type: "text",
            name: "farmers_organic_total",
            title: {
             default: "Total farmers:",
             es: "Agricultores(as) totales:",
             fr: "Total des agriculteurs/rices :",
             pt: "Total de fazendeiros(as):"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             },
             {
              type: "expression",
              text: {
               default: "The sum of male and female organic farmers is greater than the total. Please correct the error.",
               es: "La suma de los agricultores orgánicos, tanto hombres como mujeres, es mayor que el total. Corrija este error.",
               fr: "La somme des agriculteurs/rices biologiques est supérieure au total. Veuillez corriger l'erreur.",
               pt: "A soma de homens e mulheres fazendeiros orgânicos é maior do que o total. Por favor, corrija o erro."
              },
              expression: "{farmers_organic_total} >= {farmers_organic_female}+{farmers_organic_male} OR {farmers_organic_total} empty"
             }
            ]
           },
           {
            type: "text",
            name: "farmers_organic_female",
            visibleIf: "{farmers_organic_gender_not_known} empty",
            title: {
             default: "Number of female farmers:",
             es: "Número de agricultoras:",
             fr: "Nombre d'agricultrices :",
             pt: "Número de fazendeiros femininos:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "text",
            name: "farmers_organic_male",
            visibleIf: "{farmers_organic_gender_not_known} empty",
            startWithNewLine: false,
            title: {
             default: "Number of male farmers:",
             es: "Número de agricultores hombres:",
             fr: "Nombre d'agriculteurs :",
             pt: "Número de fazendeiros masculinos:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "html",
            name: "warning_organic_farmers_sum",
            visibleIf: "{farmers_organic_total} > {farmers_organic_female}+{farmers_organic_male} AND {farmers_organic_female} notempty AND {farmers_organic_male} notempty",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of male and female organic farmers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de agricultores y agricultoras orgánicas es menor que el total. Revise nuevamente que los números reportados sean correctos antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des agriculteurs/rices biologiques est inférieure au total. Veuillez vérifier que les chiffres rapportés sont corrects avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3> <span style=\"font-size: medium;\">A soma de homens e mulheres fazendeiros orgânicos é menor do que o total. Favor verificar duas vezes se os números informados estão corretos antes de seguir em frente.</span> </div>"
            }
           },
           {
            type: "checkbox",
            name: "farmers_organic_gender_not_known",
            titleLocation: "hidden",
            hideNumber: true,
            choices: [
             {
              value: "not_known",
              text: {
               default: "Please check here if you do not know the number of organic farmers by gender",
               es: "Ponga una marca aquí si no conoce el número de agricultores(as) orgánicos por género",
               fr: "Veuillez vérifier ici si vous ne connaissez pas le nombre d'agriculteurs/rices biologiques (par sexe)",
               pt: "Favor verificar aqui se você não sabe o número de fazendeiros(as) orgânicos por gênero"
              }
             }
            ]
           }
          ],
          visibleIf: "{organic_logic} anyof ['mixed', 'organic_only']",
          title: {
           default: "Organic Farmers",
           es: "Agricultores(as) orgánicos",
           fr: "Agriculteurs/rices biologiques",
           pt: "Fazendeiros(as) orgânicos"
          },
          startWithNewLine: false
         }
        ]
       },
       {
        type: "text",
        name: "farmers_page_comments",
        title: {
         default: "Optional space for comments:",
         es: "Espacio opcional para comentarios:",
         fr: "Espace facultatif pour les commentaires :",
         pt: "Espaço opcional para comentários:"
        },
        hideNumber: true
       },
       {
        type: "panel",
        name: "summary_number_of_farmers",
        elements: [
         {
          type: "expression",
          name: "farmers_total",
          title: {
           default: "Total number of farmers that are members of your organization:",
           es: "Número total de agricultores(as) que son miembros de su organización:",
           fr: "Nombre total d'agriculteurs/rices membres de votre organisation :",
           pt: "Número total de fazendeiros(as) que são membros de sua organização:"
          },
          hideNumber: true,
          expression: "{farmers_conventional_total}+{farmers_organic_total}",
          displayStyle: "decimal"
         },
         {
          type: "expression",
          name: "farmers_female",
          title: {
           default: "Number of female farmers:",
           es: "Número de agricultoras:",
           fr: "Nombre d'agricultrices :",
           pt: "Número de fazendeiros femininos:"
          },
          hideNumber: true,
          expression: "{farmers_conventional_female}+{farmers_organic_female}",
          displayStyle: "decimal"
         },
         {
          type: "expression",
          name: "farmers_male",
          startWithNewLine: false,
          title: {
           default: "Number of male farmers:",
           es: "Número de agricultores hombres:",
           fr: "Nombre d'agriculteurs :",
           pt: "Número de fazendeiros masculinos:"
          },
          hideNumber: true,
          expression: "{farmers_conventional_male}+{farmers_organic_male}",
          displayStyle: "decimal"
         }
        ],
        visibleIf: "{organic_logic} = 'mixed'",
        title: {
         default: "Summary: number of members in your organization",
         es: "Resumen: número de miembros en su organización",
         fr: "Résumé: nombre de membres dans votre organisation",
         pt: "Resumo: número de membros em sua organização"
        }
       }
      ],
      visibleIf: "{producer_setup} = 'spo' AND {consent_to_participate} = 'consent'",
      title: {
       default: "Members of your organization",
       es: "Miembros de su organización",
       fr: "Membres de votre organisation",
       pt: "Membros de sua organização"
      },
      navigationTitle: {
       default: "Members",
       es: "Miembros",
       fr: "Membres",
       pt: "Membros"
      }
     },
     {
      name: "Young people (SPOs)",
      elements: [
       {
        type: "panel",
        name: "instructions_farmers_by_age",
        elements: [
         {
          type: "html",
          name: "info_box_farmers_workers",
          html: {
           default: "<br>One of the most important pieces of information that Fairtrade stakeholders and consumers are interested in is how many male and female farmers and workers are part of the global Fairtrade community and benefit from Fairtrade certification. We are also trying to better understand the engagement of young people in Fairtrade organizations.",
           es: "<br>Una de las piezas más importantes de información que interesa a los interesados de Fairtrade y los consumidores es cuántos agricultores(as) y trabajadores(as), tanto hombres como mujeres, forman parte de la comunidad mundial de Fairtrade y se benefician de la certificación Fairtrade. También estamos intentando comprender mejor la participación de los(as) jóvenes en organizaciones de Fairtrade.",
           fr: "<br>L'une des informations les plus importantes qui intéressent les parties prenantes et les consommateurs du commerce équitable est le nombre d'agriculteurs/rices et de travailleurs/euses faisant partie de la communauté mondiale Fairtrade et bénéficiant de la certification Fairtrade. Nous essayons également de mieux comprendre l'engagement des jeunes dans les organisations Fairtrade.",
           pt: "<br>Uma das informações mais importantes nas quais as partes interessadas e os consumidores do Fairtrade querem saber quantos homens e mulheres fazendeiros(as) e trabalhadores(as) fazem parte da comunidade global do Fairtrade e se beneficiam da certificação do Fairtrade. Também estamos tentando entender melhor o engajamento dos(as) jovens nas organizações Fairtrade."
          }
         },
         {
          type: "html",
          name: "info_box_numberfarmers_byage",
          html: {
           default: "<br><b>Instructions:</b><hr>In this section, please enter the number of farmers that are members of your organization, according to the following age groups:<ul><li>16 to 28 years old</li><li>29 to 35 years old</li><li>36 years and older</li></ul>If you know the number of members for some age groups but not all, please fill in the fields that you know and leave the rest blank. If you do not know this information for any and all of the age groups, please check the box below and proceed to the next page.<br><br><i>If exact numbers are not known, estimates or minimum amounts are ok, as long as the numbers entered here are not greater than the number of farmers entered on the previous page. Please also enter the number of women and men in each age group, if this information is known or can be reasonably estimated.</i>",
           es: "<br><b>Instrucciones:</b><hr>en esta sección, ingrese el número de agricultores(as) que son miembros de su organización, de acuerdo con los grupos etarios siguientes:<ul><li>16 a 28 años</li><li>29 a 35 años</li><li>36 años y más</li></ul>Si usted conoce el número de miembros para algunos grupos etarios, pero no todos, llene los campos que conoce y deje en blanco el resto. Si usted no conoce esta información para cualquiera o ninguno de los grupos etarios, ponga una marca en el cuadro siguiente y continúe a la página siguiente.<br><br><i>Si no se conocen número exactos, está bien si da cálculos o montos mínimos siempre y cuando los números que ingrese aquí no sean mayores que el número de agricultores(as) ingresados en la página previa. También ingrese el número de mujeres y hombres en cada grupo etario si esta información es conocida y puede calcularse de manera razonable.</i>",
           fr: "<br><b>Instructions :</b><hr>Dans cette section, veuillez indiquer le nombre d'agriculteurs/rices membres de votre organisation, selon les groupes d'âge suivants :<ul><li>de 16 à 28 ans</li><li>de 29  à 35</li><li> de 36 ans et plus</li></ul>Si vous connaissez le nombre de membres pour certains groupes d'âge mais pas tous, veuillez remplir les champs que vous connaissez et laisser le reste vide. Si vous ne connaissez pas cette information pour l'un ou l'autre des groupes d'âge, veuillez cocher la case ci-dessous et passer à la page suivante.<br><br><i>Si les chiffres exacts ne sont pas connus, les estimations ou les montants minimaux sont acceptables, à condition que les chiffres rapportés ici ne soient pas supérieurs au nombre d'agriculteurs/rices rapporté à la page précédente. Veuillez également indiquer le nombre de femmes et d'hommes dans chaque groupe d'âge, si cette information est connue ou peut être estimée de façon raisonnable.</i>",
           pt: "<br><b>Instruções:</b><hr>Nesta seção, favor informar o número de fazendeiros(as) que são membros de sua organização, de acordo com as seguintes faixas etárias::<ul><li>16 a 28 anos de idade</li><li>29 a 35 anos de idade</li><li>36 anos ou mais</li></ul>Se você sabe o número de membros para algumas das faixas etárias, mas não todos, preencha os campos que você conhece e deixe o resto em branco. Se você não souber destas informações sobre qualquer um e todos os grupos etários, marque a caixa abaixo e prossiga para a página seguinte.<br><br><i>Se os números exatos não forem conhecidos, estimativas ou valores mínimos estão ok, desde que os números inseridos aqui não sejam maiores do que o número de fazendeiros(as) inseridos na página anterior. Por favor, informe também o número de mulheres e homens em cada faixa etária, se estas informações são conhecidas ou podem ser razoavelmente estimadas.</i>"
          }
         }
        ]
       },
       {
        type: "checkbox",
        name: "farmers_age_not_known",
        title: {
         default: "Do you know the number of your organization's members by age groups?",
         es: "¿Conoce usted el número de miembros de su organización por grupo etario?",
         fr: "Connaissez-vous le nombre de membres de votre organisation par groupe d'âge ?",
         pt: "Você sabe o número de membros de sua organização por faixa etária?"
        },
        titleLocation: "hidden",
        hideNumber: true,
        choices: [
         {
          value: "not_known",
          text: {
           default: "Please check here if you do not know the number of your organization's members for any of the specified age groups.",
           es: "Ponga una marca aquí si no conoce el número de miembros de su organización para cualesquiera de los grupos etarios especificados.",
           fr: "Veuillez vérifier ici si vous ne connaissez pas le nombre de membres de votre organisation pour l'un des groupes d'âge spécifiés.",
           pt: "Por favor, marque aqui se você não souber o número de membros de sua organização para qualquer uma das faixas etárias especificadas."
          }
         }
        ]
       },
       {
        type: "panel",
        name: "Number of farmers by age",
        elements: [
         {
          type: "panel",
          name: "panel_farmers_16_28",
          elements: [
           {
            type: "html",
            name: "info_box_farmers_16_28",
            html: {
             default: "<br><b>Members 16 to 28 years old</b>",
             es: "<br><b>Miembros de 16 a 28 años de edad</b>",
             fr: "<br><b>Membres de 16 à 28 ans</b>",
             pt: "<br><b>Membros de 16 a 28 anos de idade</b>"
            }
           },
           {
            type: "text",
            name: "total_farmers_16_28",
            title: {
             default: "Total farmers:",
             es: "Agricultores(as) totales:",
             fr: "Total des agriculteurs/rices :",
             pt: "Total de fazendeiros(as):"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             },
             {
              type: "expression",
              text: {
               default: "The sum of male and female farmers is greater than the total. Please correct the error.",
               es: "La suma de los agricultores, tanto hombres como mujeres, es mayor que el total. Corrija este error.",
               fr: "La somme des agriculteurs/rices est supérieure au total. Veuillez corriger l'erreur.",
               pt: "A soma de homens e mulheres fazendeiros é maior do que o total. Por favor, corrija o erro."
              },
              expression: "{total_farmers_16_28} >= {farmers_female_16_28}+{farmers_male_16_28} OR {total_farmers_16_28} empty"
             },
             {
              type: "expression",
              text: {
               default: "The sum of farmers by age group is greater than the total reported on the previous page. Please correct the error.",
               es: "La suma de agricultores(as) por grupo etario es mayor que el total reportado en la página previa. Corrija este error.",
               fr: "La somme des agriculteurs/rices par groupe d'âge est supérieure au total rapporté à la page précédente. Veuillez corriger l'erreur.",
               pt: "A soma dos fazendeiros(as) por faixa etária é maior do que o total relatado na página anterior. Por favor, corrija o erro."
              },
              expression: "{RO_farmers_age_total} <= {farmers_total} OR {total_farmers_16_28} empty"
             }
            ]
           },
           {
            type: "text",
            name: "farmers_female_16_28",
            visibleIf: "{farmers_gender_not_known_16_28} empty",
            title: {
             default: "Number of female farmers:",
             es: "Número de agricultoras:",
             fr: "Nombre d'agricultrices :",
             pt: "Número de fazendeiros femininos:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "text",
            name: "farmers_male_16_28",
            visibleIf: "{farmers_gender_not_known_16_28} empty",
            startWithNewLine: false,
            title: {
             default: "Number of male farmers:",
             es: "Número de agricultores hombres:",
             fr: "Nombre d'agriculteurs :",
             pt: "Número de fazendeiros masculinos:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "html",
            name: "warning_farmers_16to28_sum",
            visibleIf: "{total_farmers_16_28} > {farmers_female_16_28}+{farmers_male_16_28} AND {farmers_female_16_28} notempty AND {farmers_male_16_28} notempty",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of male and female farmers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de agricultores y agricultoras es menor que el total. Revise nuevamente que los números reportados sean correctos antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des agriculteurs/rices est inférieure au total. Veuillez vérifier que les chiffres rapportés sont corrects avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3> <span style=\"font-size: medium;\">A soma de homens e mulheres fazendeiros é menor do que o total. Favor verificar duas vezes se os números informados estão corretos antes de seguir em frente.</span> </div>"
            }
           },
           {
            type: "checkbox",
            name: "farmers_gender_not_known_16_28",
            titleLocation: "hidden",
            hideNumber: true,
            choices: [
             {
              value: "not_known",
              text: {
               default: "Please check here if you do not know the number of farmers age 16 to 28 years by gender",
               es: "Ponga una marca aquí si no conoce el número de agricultores(as) de 16 a 28 años de edad por género",
               fr: "Veuillez vérifier ici si vous ne connaissez pas le nombre d'agriculteurs/rices de 16 à 28 ans (par sexe)",
               pt: "Favor verificar aqui se você não sabe o número de fazendeiros(as) de 16 a 28 anos de idade por gênero"
              }
             }
            ]
           }
          ]
         },
         {
          type: "panel",
          name: "panel_farmers_29_35",
          elements: [
           {
            type: "html",
            name: "info_box_farmers_29_35",
            html: {
             default: "<br><b>Members 29 to 35 years old</b>",
             es: "<br><b>Miembros de 29 a 35 años de edad</b>",
             fr: "<br><b>Membres de 29 à 35</b>",
             pt: "<br><b>Membros de 29 e 35 anos de idade</b>"
            }
           },
           {
            type: "text",
            name: "total_farmers_29_35",
            title: {
             default: "Total farmers:",
             es: "Agricultores(as) totales:",
             fr: "Total des agriculteurs/rices :",
             pt: "Total de fazendeiros(as):"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             },
             {
              type: "expression",
              text: {
               default: "The sum of male and female farmers is greater than the total. Please correct the error.",
               es: "La suma de los agricultores, tanto hombres como mujeres, es mayor que el total. Corrija este error.",
               fr: "La somme des agriculteurs/rices est supérieure au total. Veuillez corriger l'erreur.",
               pt: "A soma de homens e mulheres fazendeiros é maior do que o total. Por favor, corrija o erro."
              },
              expression: "{total_farmers_29_35} >= {farmers_female_29_35}+{farmers_male_29_35} OR {total_farmers_29_35} empty"
             },
             {
              type: "expression",
              text: {
               default: "The sum of farmers by age group is greater than the total reported on the previous page. Please correct the error.",
               es: "La suma de agricultores(as) por grupo etario es mayor que el total reportado en la página previa. Corrija este error.",
               fr: "La somme des agriculteurs/rices par groupe d'âge est supérieure au total rapporté à la page précédente. Veuillez corriger l'erreur.",
               pt: "A soma dos fazendeiros(as) por faixa etária é maior do que o total relatado na página anterior. Por favor, corrija o erro."
              },
              expression: "{RO_farmers_age_total} <= {farmers_total} OR {total_farmers_29_35} empty"
             }
            ]
           },
           {
            type: "text",
            name: "farmers_female_29_35",
            visibleIf: "{farmers_gender_not_known_29_35} empty",
            title: {
             default: "Number of female farmers:",
             es: "Número de agricultoras:",
             fr: "Nombre d'agricultrices :",
             pt: "Número de fazendeiros femininos:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "text",
            name: "farmers_male_29_35",
            visibleIf: "{farmers_gender_not_known_29_35} empty",
            startWithNewLine: false,
            title: {
             default: "Number of male farmers:",
             es: "Número de agricultores hombres:",
             fr: "Nombre d'agriculteurs :",
             pt: "Número de fazendeiros masculinos:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "html",
            name: "warning_farmers_29to35_sum",
            visibleIf: "{total_farmers_29_35} > {farmers_female_29_35}+{farmers_male_29_35} AND {farmers_female_29_35} notempty AND {farmers_male_29_35} notempty",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of male and female farmers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de agricultores y agricultoras es menor que el total. Revise nuevamente que los números reportados sean correctos antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des agriculteurs/rices est inférieure au total. Veuillez vérifier que les chiffres rapportés sont corrects avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3> <span style=\"font-size: medium;\">A soma de homens e mulheres fazendeiros é menor do que o total. Favor verificar duas vezes se os números informados estão corretos antes de seguir em frente.</span> </div>"
            }
           },
           {
            type: "checkbox",
            name: "farmers_gender_not_known_29_35",
            titleLocation: "hidden",
            hideNumber: true,
            choices: [
             {
              value: "not_known",
              text: {
               default: "Please check here if you do not know the number of farmers age 29 to 35 years by gender",
               es: "Ponga una marca aquí si no conoce el número de agricultores(as) de 29 a 35 años de edad por género",
               fr: "Veuillez vérifier ici si vous ne connaissez pas le nombre d'agriculteurs/rices de 29 à 35 ans (par sexe)",
               pt: "Favor verificar aqui se você não sabe o número de fazendeiros(as) de 29 a 35 anos de idade por gênero"
              }
             }
            ]
           }
          ]
         },
         {
          type: "panel",
          name: "panel_farmers_36",
          elements: [
           {
            type: "html",
            name: "info_box_farmers_36",
            html: {
             default: "<br><b>Members 36 years and older</b>",
             es: "<br><b>Miembros de 36 años o más</b>",
             fr: "<br><b>Membres de 36 ans et plus</b>",
             pt: "<br><b>Membros de 36 anos de idade ou mais velhos</b>"
            }
           },
           {
            type: "text",
            name: "total_farmers_36",
            title: {
             default: "Total farmers:",
             es: "Agricultores(as) totales:",
             fr: "Total des agriculteurs/rices :",
             pt: "Total de fazendeiros(as):"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             },
             {
              type: "expression",
              text: {
               default: "The sum of male and female farmers is greater than the total. Please correct the error.",
               es: "La suma de los agricultores, tanto hombres como mujeres, es mayor que el total. Corrija este error.",
               fr: "La somme des agriculteurs/rices est supérieure au total. Veuillez corriger l'erreur.",
               pt: "A soma de homens e mulheres fazendeiros é maior do que o total. Por favor, corrija o erro."
              },
              expression: "{total_farmers_36} >= {farmers_female_36}+{farmers_male_36} OR {total_farmers_36} empty"
             },
             {
              type: "expression",
              text: {
               default: "The sum of farmers by age group is greater than the total reported on the previous page. Please correct the error.",
               es: "La suma de agricultores(as) por grupo etario es mayor que el total reportado en la página previa. Corrija este error.",
               fr: "La somme des agriculteurs/rices par groupe d'âge est supérieure au total rapporté à la page précédente. Veuillez corriger l'erreur.",
               pt: "A soma dos fazendeiros(as) por faixa etária é maior do que o total relatado na página anterior. Por favor, corrija o erro."
              },
              expression: "{RO_farmers_age_total} <= {farmers_total} OR {total_farmers_36} empty"
             }
            ]
           },
           {
            type: "text",
            name: "farmers_female_36",
            visibleIf: "{farmers_gender_not_known_36} empty",
            title: {
             default: "Number of female farmers:",
             es: "Número de agricultoras:",
             fr: "Nombre d'agricultrices :",
             pt: "Número de fazendeiros femininos:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "text",
            name: "farmers_male_36",
            visibleIf: "{farmers_gender_not_known_36} empty",
            startWithNewLine: false,
            title: {
             default: "Number of male farmers:",
             es: "Número de agricultores hombres:",
             fr: "Nombre d'agriculteurs :",
             pt: "Número de fazendeiros masculinos:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "html",
            name: "warning_farmers_36_sum",
            visibleIf: "{total_farmers_36} > {farmers_female_36}+{farmers_male_36} AND {farmers_female_36} notempty AND {farmers_male_36} notempty",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of male and female farmers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de agricultores y agricultoras es menor que el total. Revise nuevamente que los números reportados sean correctos antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des agriculteurs/rices est inférieure au total. Veuillez vérifier que les chiffres rapportés sont corrects avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3> <span style=\"font-size: medium;\">A soma de homens e mulheres fazendeiros é menor do que o total. Favor verificar duas vezes se os números informados estão corretos antes de seguir em frente.</span> </div>"
            }
           },
           {
            type: "checkbox",
            name: "farmers_gender_not_known_36",
            titleLocation: "hidden",
            choices: [
             {
              value: "not_known",
              text: {
               default: "Please check here if you do not know the number of farmers 36 years and older by gender",
               es: "Ponga una marca aquí si no conoce el número de agricultores(as) de 36 años o más por género",
               fr: "Veuillez vérifier ici si vous ne connaissez pas le nombre d'agriculteurs/rices de 36 ans et plus (par sexe)",
               pt: "Favor verificar aqui se você não sabe o número de fazendeiros(as) de 36 anos de idade ou mais por gênero"
              }
             }
            ]
           }
          ]
         }
        ],
        visibleIf: "{farmers_age_not_known} empty"
       },
       {
        type: "text",
        name: "farmers_age_page_comments",
        visibleIf: "{farmers_age_not_known} empty",
        title: {
         default: "Optional space for comments:",
         es: "Espacio opcional para comentarios:",
         fr: "Espace facultatif pour les commentaires :",
         pt: "Espaço opcional para comentários:"
        },
        hideNumber: true
       },
       {
        type: "panel",
        name: "Summary of farmers reported",
        elements: [
         {
          type: "panel",
          name: "farmers_total_summary_byage",
          elements: [
           {
            type: "expression",
            name: "RO_farmers_age_total",
            title: {
             default: "Number of farmers reported in an age group:",
             es: "Número de agricultores(as) reportados en un grupo etario:",
             fr: "Nombre d'agriculteurs/rices rapporté dans un groupe d'âge :",
             pt: "Número de fazendeiros(as) relatados em uma faixa etária:"
            },
            hideNumber: true,
            expression: "{total_farmers_16_28}+{total_farmers_29_35}+{total_farmers_36}",
            displayStyle: "decimal"
           },
           {
            type: "expression",
            name: "RO_farmers_age_unknown",
            startWithNewLine: false,
            title: {
             default: "Number of farmers (age unknown):",
             es: "Número de agricultores(as) (edad desconocida):",
             fr: "Nombre d'agriculteurs/rices (âge inconnu) :",
             pt: "Número de fazendeiros(as) (idade desconhecida):"
            },
            hideNumber: true,
            expression: "{farmers_total}-{RO_farmers_age_total}",
            displayStyle: "decimal"
           },
           {
            type: "html",
            name: "warning_farmers_byage_sum",
            visibleIf: "{farmers_total} > {RO_farmers_age_total}",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of farmers by age group is less than the total reported on the previous page. Please double check that the numbers reported are correct before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de agricultores(as) por grupo etario es menor que el total reportado en la página previa. Revise nuevamente que los números reportados sean correctos antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des agriculteurs/rices par groupe d’âge est inférieure au total rapporté à la page précédente. Veuillez vérifier que les chiffres rapportés sont corrects avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3>\n<span style=\"font-size: medium;\">A soma de fazendeiros(as) por faixa etária é menor que o total relatado nas páginas anteriores. Favor verificar duas vezes se os números informados estão corretos antes de seguir em frente.</span>\n</div>"
            }
           },
           {
            type: "html",
            name: "warning_farmers_total_byage",
            visibleIf: "{RO_farmers_age_total} > {farmers_total}",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of farmers by age group is greater than the total reported on the previous page. Please correct the error before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de agricultores(as) por grupo etario es mayor que el total reportado en la página previa. Corrija el error antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des agriculteurs/rices par groupe d’âge est inférieure au total rapporté à la page précédente. Veuillez corriger l’erreur avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3>\n<span style=\"font-size: medium;\">A soma de fazendeiros(as) por faixa etária é maior que o total relatado nas páginas anteriores. Favor corrigir o erro antes de seguir em frente.</span>\n</div>"
            }
           }
          ],
          title: {
           default: "Total number of farmers in your organization: {farmers_total}",
           es: "Número total de agricultores(as) en su organización: {farmers_total}",
           fr: "Nombre total d'agriculteurs/rices dans votre organisation : {farmers_total}",
           pt: "Número total de fazendeiros(as) em sua organização: {farmers_total}"
          }
         },
         {
          type: "panel",
          name: "farmers_female_summary_byage",
          elements: [
           {
            type: "expression",
            name: "RO_farmers_age_female_total",
            title: {
             default: "Number of female farmers reported in an age group:",
             es: "Número de agricultoras reportadas en un grupo etario:",
             fr: "Nombre d'agricultrices rapporté dans un groupe d'âge :",
             pt: "Número de fazendeiros femininos relatados em uma faixa etária:"
            },
            hideNumber: true,
            expression: "{farmers_female_16_28}+{farmers_female_29_35}+{farmers_female_36}",
            displayStyle: "decimal"
           },
           {
            type: "expression",
            name: "RO_farmers_age_female_unknown",
            startWithNewLine: false,
            title: {
             default: "Number of female farmers (age unknown):",
             es: "Número de agricultoras (edad desconocida):",
             fr: "Nombre d'agricultrices (âge inconnu) :",
             pt: "Número de fazendeiros femininos (idade desconhecida):"
            },
            hideNumber: true,
            expression: "{farmers_female}-{RO_farmers_age_female_total}",
            displayStyle: "decimal"
           },
           {
            type: "html",
            name: "warning_farmers_female_byage",
            visibleIf: "{RO_farmers_age_female_total} > {farmers_female}",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of female farmers by age group is greater than the total reported on the previous page. Please correct the error before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de agricultoras por grupo etario es mayor que el total reportado en la página previa. Corrija el error antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des agricultrices par groupe d’âge est supérieur au total rapporté à la page précédente. Veuillez corriger l’erreur avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3> <span style=\"font-size: medium;\">A soma de fazendeiros femininos por faixa etária é maior que o total relatado nas páginas anteriores. Favor corrigir o erro antes de seguir em frente.</span> </div>"
            }
           }
          ],
          title: {
           default: "Total number of female farmers in your organization: {farmers_female}",
           es: "Número total de agricultoras en su organización: {farmers_female}",
           fr: "Nombre total d'agricultrices dans votre organisation : {farmers_female}",
           pt: "Número total de fazendeiros femininos em sua organização: {farmers_female}"
          }
         },
         {
          type: "panel",
          name: "farmers_male_summary_byage",
          elements: [
           {
            type: "expression",
            name: "RO_farmers_age_male_total",
            title: {
             default: "Number of male farmers reported in an age group:",
             es: "Número de agricultores hombres reportados en un grupo etario:",
             fr: "Nombre d'agriculteurs rapporté dans un groupe d'âge :",
             pt: "Número de fazendeiros masculinos relatados em uma faixa etária:"
            },
            expression: "{farmers_male_16_28}+{farmers_male_29_35}+{farmers_male_36}",
            displayStyle: "decimal"
           },
           {
            type: "expression",
            name: "RO_farmers_age_male_unknown",
            startWithNewLine: false,
            title: {
             default: "Number of male farmers (age unknown):",
             es: "Número de agricultores hombres (edad desconocida):",
             fr: "Nombre d'agriculteurs (âge inconnu) :",
             pt: "Número de fazendeiros masculinos (idade desconhecida):"
            },
            hideNumber: true,
            expression: "{farmers_male}-{RO_farmers_age_male_total}",
            displayStyle: "decimal"
           },
           {
            type: "html",
            name: "warning_farmers_male_byage",
            visibleIf: "{RO_farmers_age_male_total} > {farmers_male}",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of male farmers by age group is greater than the total reported on the previous page. Please correct the error before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de agricultores hombres por grupo etario es mayor que el total reportado en la página previa. Corrija el error antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des agriculteurs par groupe d’âge est supérieur au total rapporté à la page précédente. Veuillez corriger l’erreur avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3> <span style=\"font-size: medium;\">A soma de fazendeiros masculinos por faixa etária é maior que o total relatado nas páginas anteriores. Favor corrigir o erro antes de seguir em frente.</span> </div>"
            }
           }
          ],
          title: {
           default: "Total number of male farmers in your organization: {farmers_male}",
           es: "Número total de agricultores hombres en su organización: {farmers_male}",
           fr: "Nombre total d'agriculteurs dans votre organisation : {farmers_male}",
           pt: "Número total de fazendeiros masculinos em sua organização: {farmers_male}"
          }
         }
        ],
        visibleIf: "{farmers_age_not_known} empty",
        title: {
         default: "Summary: number of members in your organization reported by age group",
         es: "Resumen: número de miembros en su organización reportados por grupo etario",
         fr: "Résumé : nombre de membres de votre organisation rapporté par groupe d'âge",
         pt: "Resumo: número de membros em sua organização relatados por faixa etária"
        }
       }
      ],
      visibleIf: "{producer_setup} = 'spo' AND {consent_to_participate} = 'consent'",
      title: {
       default: "Number of young people as members of your organization",
       es: "Número de jóvenes que son miembros de su organización",
       fr: "Nombre de jeunes membres de votre organisation",
       pt: "Número de jovens como membros de sua organização"
      },
      navigationTitle: {
       default: "Young people",
       es: "Jóvenes",
       fr: "Les jeunes",
       pt: "Jovens"
      }
     },
     {
      name: "Workers",
      elements: [
       {
        type: "panel",
        name: "Info box workers",
        elements: [
         {
          type: "html",
          name: "info_box_farmers_workers",
          html: {
           default: "<br>One of the most important pieces of information that Fairtrade stakeholders and consumers are interested in is how many male and female farmers and workers are part of the global Fairtrade community and benefit from Fairtrade certification. This helps Fairtrade understand and communicate our reach, analyse trends over time, and guide our global strategy.",
           es: "<br>Una de las piezas más importantes de información que interesa a los interesados de Fairtrade y los consumidores es cuántos agricultores(as) y trabajadores(as), tanto hombres como mujeres, forman parte de la comunidad mundial de Fairtrade y se benefician de la certificación Fairtrade. Esto ayuda a que Fairtrade entienda y comunique nuestro alcance, analice tendencias con el tiempo y guíe nuestra estrategia mundial.",
           fr: "<br>L'une des informations les plus importantes qui intéressent les parties prenantes et les consommateurs du commerce équitable est le nombre d'agriculteurs/rices et de travailleurs/euses faisant partie de la communauté mondiale Fairtrade et bénéficiant de la certification Fairtrade. Cela aide Fairtrade à comprendre et à communiquer notre portée, à analyser les tendances au fil du temps et à guider notre stratégie mondiale.",
           pt: "<br>Uma das informações mais importantes nas quais as partes interessadas e os consumidores do Fairtrade querem saber quantos homens e mulheres fazendeiros(as) e trabalhadores(as) fazem parte da comunidade global do Fairtrade e se beneficiam da certificação do Fairtrade. Isto ajuda o Fairtrade a entender e comunicar nosso alcance, analisar tendências ao longo do tempo e orientar nossa estratégia global."
          }
         },
         {
          type: "html",
          name: "info_box_numberworkers",
          html: {
           default: "<br><b>Instructions:</b><hr>In this section, please enter the number of workers hired by your organization according to the following types of employment contract types: <b>permanent, fixed-term</b> and <b>sub-contracted</b>. Definitions for each contract type are provided in the corresponding section of the page. Please also enter the number of women and men your organization employs, if this information is known.",
           es: "<br><b>Instrucciones:</b><hr>en esta sección,  ingrese el número de trabajadores(as) contratados por su organización de acuerdo con los tipos siguientes de tipos de contrato de empleo: <b>permanentes, fijos</b> y <b>subcontratados</b>. En la sección correspondiente de la página se proporcionan definiciones de cada tipo de contrato. También ingrese el número de mujeres y hombres en que emplea su organización si conoce esta información.",
           fr: "<br><b>Instructions :</b><hr>Dans cette section, veuillez entrer le nombre de travailleurs/euses embauchés/ées par votre organisation selon les types de contrats d'emploi suivants : <B>permanents, à durée déterminée</b> et <b>en contrat de sous-traitance</b>. Les définitions de chaque type de contrat sont fournies dans la section de la page correspondante. Veuillez également indiquer le nombre de femmes et d'hommes que votre organisation emploie, si cette information est connue.",
           pt: "<br><b>Instruções:</b><hr>Nesta seção, favor informar o número de trabalhadores(as) contratados por sua organização de acordo com os seguintes tipos de contratos de trabalho: <b>permanente, a termo fixo</b> e <b>subcontratado</b>. Definições para cada tipo de contrato são fornecidas na seção correspondente da página. Por favor, digite também o número de mulheres e homens que sua organização emprega, se esta informação for conhecida."
          }
         },
         {
          type: "html",
          name: "info_box_spo_only",
          visibleIf: "{producer_setup} = 'spo'",
          html: {
           default: "<br>This section applies <b>only to those workers hired by your organization directly.</b> Workers hired by individual members that work on farms should <i>not</i> be counted in this section.",
           es: "<br>Esta sección aplica <b>solamente para aquellos trabajadores(as) contratados por su organización de manera directa.</b> Los(as) trabajadores(as) contratados por miembros individuales que trabajan en las granjas <i>no</i> deben contarse en esta sección.",
           fr: "<br>Cette section s’applique <b>uniquement aux travailleurs/euses embauchés/ées directement par votre organisation.</b> Les travailleurs/euses embauchés/ées par des membres spécifiques qui travaillent dans les plantations ne doivent <i>pas</i> être comptés/ées dans cette section",
           pt: "<br>Esta seção se aplica <b>somente para aqueles trabalhadores(as) contratados diretamente por sua organização.</b> Trabalhadores(as) contratados por membros individuais que trabalham em fazendas <i>não</i> devem ser contados nesta seção."
          }
         },
         {
          type: "html",
          name: "info_workerdefinition",
          html: {
           default: "<br><i><b>Workers</b> are defined as all waged employees including migrant, temporary, seasonal, sub-contracted and permanent workers. Workers include all hired personnel whether they work in the field, in processing sites, or in administration. The term is restricted to personnel that can be unionised and therefore middle and senior and other professionals are generally not considered workers. For all types of workers, employment refers to any activity that one performs to produce goods or provide services for pay or profit.</i>",
           es: "<br>Se define a los <i><b>trabajadores(as)</b> como todos los empleados(as) asalariados, incluyendo a migrantes, temporales, estacionales, subcontratados y permanentes. Los(as) trabajadores(as) incluyen a todo el personal contratado, ya sea que trabaje en el campo, sitios de procesamiento o en administración. El término se restringe al personal que puede sindicalizarse y, por lo tanto, no se considera como trabajadores(as) a empleados de puestos medios y altos u otros profesionales. Para todos(as) los(as) tipos(as) de trabajadores(as), empleo se refiere a cualquier actividad que uno realiza para producir productos o proporcionar servicio por un pago o ganancia.</i>",
           fr: "<br><i><b>Les travailleurs/euses</b> incluent tous/tes les salariés/ées, y compris les travailleurs/euses migrants/es, temporaires, saisonniers/ères, sous-traitants/es et permanents/es. Les travailleurs/euses comprennent tout le personnel embauché, qu'il travaille sur le terrain, sur les sites de transformation ou dans l'administration. Le terme est limité au personnel qui peut être syndiqué et par conséquent, les cadres intermédiaires et supérieurs/es et les autres professionnels/elles ne sont généralement pas considérés/ées comme des travailleurs/euses. Pour tous les types de travailleurs/euses, l'emploi désigne toute activité qu’une personne exerce pour produire des biens ou fournir des services moyennant rémunération ou à but lucratif.</i>",
           pt: "<br><i><b>Trabalhadores(as)</b> são definidos como todos os trabalhadores(as) assalariados, incluindo trabalhadores migrantes, temporários, sazonais, subcontratados e permanentes. Trabalhadores(as) incluem todo o pessoal contratado quer trabalhem no campo, em locais de processamento ou na administração. O termo é restrito ao pessoal que pode ser sindicalizado e, portanto, os profissionais médios e superiores e outros profissionais geralmente não são considerados trabalhadores(as). Para todos(as) os(as) tipos(as) de trabalhadores(as), o emprego refere-se a qualquer atividade que se realiza para produzir bens ou prestar serviços por remuneração ou lucro.</i>"
          }
         }
        ]
       },
       {
        type: "panel",
        name: "Number of workers",
        elements: [
         {
          type: "panel",
          name: "workers_permanent_panel",
          elements: [
           {
            type: "html",
            name: "info_box_permanent_worker",
            html: {
             default: "<br>A <b>permanent worker</b> is a worker that has an employment relationship with the company/organization for an indefinite period of time",
             es: "<br>Un <b>trabajador(a) permanente</b> es un(a) trabajador(a) que tiene una relación de empleo con la empresa/organización por u periodo indefinido de tiempo",
             fr: "<br>Un/une <b>travailleur/euse permanent/e</b> est une personne ayant une relation d’emploi avec la société/l’organisation pour une durée indéterminée",
             pt: "<br>Um <b>trabalhador(a) permanente</b> é um(a) trabalhador(a) que tem uma relação de trabalho com a empresa/organização por um período de tempo indefinido"
            }
           },
           {
            type: "text",
            name: "workers_permanent_total",
            title: {
             default: "Total permanent workers:",
             es: "Trabajadores(as) permanentes totales:",
             fr: "Total des travailleurs/euses permanents/es",
             pt: "Total de trabalhadores(as) permanentes:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             },
             {
              type: "expression",
              text: {
               default: "The sum of male and female permanent workers is greater than the total. Please correct the error.",
               es: "La suma de los trabajadores permanentes, tanto hombres como mujeres, es mayor que el total. Corrija este error.",
               fr: "La somme des travailleurs/euses permanents/es est supérieure au total. Veuillez corriger l'erreur.",
               pt: "A soma de homens e mulheres trabalhadores permanentes é maior do que o total. Por favor, corrija o erro."
              },
              expression: "{workers_permanent_total} >= {workers_permanent_female}+{workers_permanent_male} OR {workers_permanent_total} empty"
             }
            ]
           },
           {
            type: "text",
            name: "workers_permanent_female",
            visibleIf: "{permanent_gender_not_known} empty",
            title: {
             default: "Number of female permanent workers:",
             es: "Número de trabajadoras permanentes:",
             fr: "Nombre de travailleuses permanentes :",
             pt: "Número de trabalhadores femininos permanentes"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "text",
            name: "workers_permanent_male",
            visibleIf: "{permanent_gender_not_known} empty",
            startWithNewLine: false,
            title: {
             default: "Number of male permanent workers:",
             es: "Número de trabajadores hombres permanentes:",
             fr: "Nombre de travailleurs permanents :",
             pt: "Número de trabalhadores masculinos permanentes"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "html",
            name: "warning_permanent_workers_sum",
            visibleIf: "{workers_permanent_total} > {workers_permanent_female}+{workers_permanent_male} AND {workers_permanent_female} notempty AND {workers_permanent_male} notempty",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of male and female permanent workers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de trabajadores y trabajadoras es menor que el total. Revise nuevamente que los números reportados sean correctos antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des travailleurs/euses permanents/es est inférieure au total. Veuillez vérifier que les chiffres rapportés sont corrects avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3>\n<span style=\"font-size: medium;\">A soma de homens e mulheres trabalhadores permanentes é menor do que o total. Favor verificar duas vezes se os números informados estão corretos antes de seguir em frente.</span>\n</div>"
            }
           },
           {
            type: "checkbox",
            name: "permanent_gender_not_known",
            titleLocation: "hidden",
            hideNumber: true,
            choices: [
             {
              value: "not_known",
              text: {
               default: "Please check here if you do not know the number of women and men employed under a permanent contract",
               es: "Ponga una marca aquí si no conoce el número de hombres y mujeres empleados bajo un contrato permanente",
               fr: "Veuillez vérifier ici si vous ne connaissez pas le nombre d’employés/ées sous contrat permanent",
               pt: "Favor verificar aqui se você não sabe o número de mulheres e homens empregados sob um contrato permanente"
              }
             }
            ]
           }
          ],
          title: {
           default: "Workers employed under a permanent contract",
           es: "Trabajadores(as) empleados bajo un contrato permanente",
           fr: "Travailleurs/euses employés/ées sous contrat permanent",
           pt: "Trabalhadores(as) empregados sob um contrato permanente"
          }
         },
         {
          type: "panel",
          name: "workers_fixedterm_panel",
          elements: [
           {
            type: "html",
            name: "info_box_fixedterm_worker",
            html: {
             default: "<br>A <b>fixed-term worker (or temporary)</b> worker is a worker that has an employment relationship with the company/organization that automatically ends or may be extended after a certain duration previously agreed with the employer",
             es: "<br>Un <b>empleado(a) a término fijo (o temporal)</b> es un(a) trabajador(a) que tiene una relación de empleo con la empresa/organización que termina automáticamente o que puede extenderse después de determinada duración acordada previamente con el empleador",
             fr: "<br>Un/une <b>employé/ée à durée déterminée (ou temporaire)</b> est une personne ayant une relation d’emploi avec la société/l’organisation qui prend fin automatiquement ou qui peut être prolongée après une certaine durée précédemment convenue avec l’employeur.",
             pt: "<br>Um <b>trabalhador(a) a termo fixo (ou temporário)</b> é um(a) trabalhador(a) que tem uma relação de trabalho com a empresa/organização que termina automaticamente ou pode ser prorrogada após uma determinada duração previamente acordada com o empregador"
            }
           },
           {
            type: "text",
            name: "workers_fixed_term_total",
            title: {
             default: "Total fixed-term workers:",
             es: "Trabajadores(as) a término fijo totales:",
             fr: "Total des travailleurs/euses à durée déterminée :",
             pt: "Total de trabalhadores(as) a termo fixo:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             },
             {
              type: "expression",
              text: {
               default: "The sum of male and female fixed-term workers is greater than the total. Please correct the error.",
               es: "La suma de los trabajadores a  término fijo, tanto hombres como mujeres, es mayor que el total. Corrija este error.",
               fr: "La somme des travailleurs/euses à durée déterminée est supérieure au total : Veuillez corriger l'erreur.",
               pt: "A soma de homens e mulheres trabalhadores a termo fixo é maior do que o total. Por favor, corrija o erro."
              },
              expression: "{workers_fixed_term_total} >= {workers_fixed_term_female}+{workers_fixed_term_male} OR {workers_fixed_term_total} empty"
             }
            ]
           },
           {
            type: "text",
            name: "workers_fixed_term_female",
            visibleIf: "{workers_fixedterm_gender_not_known} empty",
            title: {
             default: "Number of female fixed-term workers:",
             es: "Número de trabajadoras a término fijo:",
             fr: "Nombre de travailleuses à durée déterminée :",
             pt: "Número de trabalhadores femininos a termo fixo"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "text",
            name: "workers_fixed_term_male",
            visibleIf: "{workers_fixedterm_gender_not_known} empty",
            startWithNewLine: false,
            title: {
             default: "Number of male fixed-term workers:",
             es: "Número de trabajadores hombres a término fijo:",
             fr: "Nombre de travailleurs à durée déterminée :",
             pt: "Número de trabalhadores masculinos a termo fixo"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "html",
            name: "warning_fixed_term_workers_sum",
            visibleIf: "{workers_fixed_term_total} > {workers_fixed_term_female}+{workers_fixed_term_male} AND {workers_fixed_term_female} notempty AND {workers_fixed_term_male} notempty",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of male and female fixed-term workers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de trabajadores y trabajadoras a término fijo es menor que el total. Revise nuevamente que los números reportados sean correctos antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des travailleurs/euses à durée déterminée est inférieure au total. Veuillez vérifier que les chiffres rapportés sont corrects avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3> <span style=\"font-size: medium;\">A soma de homens e mulheres trabalhadores a termo fixo é menor do que o total. Favor verificar duas vezes se os números informados estão corretos antes de seguir em frente.</span> </div>"
            }
           },
           {
            type: "checkbox",
            name: "workers_fixedterm_gender_not_known",
            titleLocation: "hidden",
            hideNumber: true,
            choices: [
             {
              value: "not_known",
              text: {
               default: "Please check here if you do not know the number of women and men employed under a fixed-term contract",
               es: "Ponga una marca aquí si no conoce el número de hombres y mujeres empleados bajo un contrato a término fijo",
               fr: "Veuillez vérifier ici si vous ne connaissez pas le nombre d’employés/ées sous contrat à durée déterminée",
               pt: "Favor verificar aqui se você não sabe o número de mulheres e homens empregados sob um contrato a termo fixo"
              }
             }
            ]
           }
          ],
          title: {
           default: "Workers employed under a fixed-term contract",
           es: "Trabajadores(as) empleados bajo un contrato de término fijo",
           fr: "Travailleurs/euses employés/ées sous contrat à durée déterminée",
           pt: "Trabalhadores(as) empregados sob um contrato a termo fixo"
          }
         },
         {
          type: "panel",
          name: "workers_subcontractor_panel",
          elements: [
           {
            type: "html",
            name: "info_box_subcontractor_worker",
            html: {
             default: "<br>A <b>sub-contracted worker</b> is a worker employed and paid by a third party, usually a labour broker, to provide labour to a third party in exchange for a fee that is collected by the broker",
             es: "<br>Un <b>trabajador(a) subcontratado(a)</b> es un(a) trabajador(a) empleado y pagado por un tercero, por lo general un agente laboral, que proporciona mano de obra a un tercero a cambio de una tarifa que cobra el agente",
             fr: "<br>Un/une <b>travailleur/euse en contrat de sous-traitance</b> est une personne employée et payée par un tiers, généralement un courtier en main d'œuvre, pour fournir une main d'œuvre à un tiers moyennant des frais perçus par le courtier",
             pt: "<br>Um <b>trabalhador(a) subcontratado(a)</b> é um(a) trabalhador(a) empregado e pago por um terceiro, geralmente um corretor de mão-de-obra, para fornecer mão-de-obra a um terceiro em troca de uma taxa que é cobrada pelo corretor"
            }
           },
           {
            type: "text",
            name: "workers_subcontractor_total",
            title: {
             default: "Total sub-contracted workers:",
             es: "Trabajadores(as) subcontratados(as) totales:",
             fr: "Total des travailleurs/euses en contrat de sous-traitance :",
             pt: "Total de trabalhadores(as) subcontratados:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             },
             {
              type: "expression",
              text: {
               default: "The sum of male and female sub-contracted workers is greater than the total. Please correct the error.",
               es: "La suma de los trabajadores subcontratados, tanto hombres como mujeres, es mayor que el total. Corrija este error.",
               fr: "La somme des travailleurs/euses en contrat de sous-traitance est supérieure au total. Veuillez corriger l'erreur.",
               pt: "A soma de homens e mulheres trabalhadores subcontradados é maior do que o total. Por favor, corrija o erro."
              },
              expression: "{workers_subcontractor_total} >= {workers_subcontractor_female}+{workers_subcontractor_male} OR {workers_subcontractor_total} empty"
             }
            ]
           },
           {
            type: "text",
            name: "workers_subcontractor_female",
            visibleIf: "{workers_subcontractor_gender_not_known} empty",
            title: {
             default: "Number of female sub-contracted workers:",
             es: "Número de trabajadoras subcontratadas:",
             fr: "Nombre de travailleuses en contrat de sous-traitance :",
             pt: "Número de trabalhadores femininos subcontradados:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "text",
            name: "workers_subcontractor_male",
            visibleIf: "{workers_subcontractor_gender_not_known} empty",
            startWithNewLine: false,
            title: {
             default: "Number of male sub-contracted workers:",
             es: "Número de trabajadores hombres subcontratados:",
             fr: "Nombre de travailleurs en contrat de sous-traitance :",
             pt: "Número de trabalhadores masculinos subcontradados:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "html",
            name: "warning_subcontractor_workers_sum",
            visibleIf: "{workers_subcontractor_total} > {workers_subcontractor_female}+{workers_subcontractor_male} AND {workers_subcontractor_female} notempty AND {workers_subcontractor_male} notempty",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of male and female subcontracted workers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de trabajadores y trabajadoras subcontratadas es menor que el total. Revise nuevamente que los números reportados sean correctos antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des travailleurs/euses en contrat de sous-traitance est inférieure au total. Veuillez vérifier que les chiffres rapportés sont corrects avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3> <span style=\"font-size: medium;\">A soma de homens e mulheres trabalhadores subcontradados é menor do que o total. Favor verificar duas vezes se os números informados estão corretos antes de seguir em frente.</span> </div>"
            }
           },
           {
            type: "checkbox",
            name: "workers_subcontractor_gender_not_known",
            titleLocation: "hidden",
            hideNumber: true,
            choices: [
             {
              value: "not_known",
              text: {
               default: "Please check here if you do not know the number of women and men sub-contracted by a third party",
               es: "Ponga una marca aquí si no conoce el número de hombres y mujeres subcontratados por un tercero",
               fr: "Veuillez vérifier ici si vous ne connaissez pas le nombre de travailleurs/euses en contrat de sous-traitance avec un tiers",
               pt: "Favor verificar aqui se você não sabe o número de mulheres e homens subcontradados por um terceiro"
              }
             }
            ]
           }
          ],
          title: {
           default: "Sub-contracted workers employed by a third party",
           es: "Empleados(as) subcontratados(as) empleados por un tercero",
           fr: "Travailleurs/euses en contrat de sous-traitance avec un tiers",
           pt: "Trabalhadores(as) subcontratados(as) empregados por um terceiro"
          }
         }
        ]
       },
       {
        type: "text",
        name: "workers_page_comments",
        title: {
         default: "Optional space for comments:",
         es: "Espacio opcional para comentarios:",
         fr: "Espace facultatif pour les commentaires :",
         pt: "Espaço opcional para comentários:"
        },
        hideNumber: true
       },
       {
        type: "panel",
        name: "summary_number_of_workers",
        elements: [
         {
          type: "expression",
          name: "workers_total",
          title: {
           default: "Total number of workers employed by your organization:",
           es: "Número total de trabajadores(as) empleados por su organización:",
           fr: "Nombre total de travailleurs/euses employés/ées par votre organisation :",
           pt: "Número total de trabalhadores(as) empregados por sua organização"
          },
          hideNumber: true,
          expression: "{workers_permanent_total}+{workers_fixed_term_total}+{workers_subcontractor_total}",
          displayStyle: "decimal"
         },
         {
          type: "expression",
          name: "workers_female",
          title: {
           default: "Number of female workers:",
           es: "Número de trabajadoras:",
           fr: "Nombre de travailleuses :",
           pt: "Número de trabalhadores femininos:"
          },
          hideNumber: true,
          expression: "{workers_permanent_female}+{workers_fixed_term_female}+{workers_subcontractor_female}",
          displayStyle: "decimal"
         },
         {
          type: "expression",
          name: "workers_male",
          startWithNewLine: false,
          title: {
           default: "Number of male workers:",
           es: "Número de trabajadores hombres:",
           fr: "Nombre de travailleurs :",
           pt: "Número de trabalhadores masculinos:"
          },
          hideNumber: true,
          expression: "{workers_permanent_male}+{workers_fixed_term_male}+{workers_subcontractor_male}",
          displayStyle: "decimal"
         },
         {
          type: "expression",
          name: "workers_seasonal_max_hidden",
          visible: false,
          title: {
           default: "Max number of seasonal workers",
           es: "Número máximo de trabajadores(as) estacionales",
           fr: "Nombre maximal de travailleurs/euses saisonniers/ères",
           pt: "Número máximo de trabalhadores(as) sazonais"
          },
          hideNumber: true,
          expression: "{workers_fixed_term_total}+{workers_subcontractor_total}",
          displayStyle: "decimal"
         }
        ],
        title: {
         default: "Summary: number of workers in your organization",
         es: "Resumen: número de trabajadores(as) en su organización",
         fr: "Résumé : nombre de travailleurs/euses dans votre organisation",
         pt: "Resumo: número de trabalhadores(as) em sua organização"
        }
       },
       {
        type: "panel",
        name: "Info box seasonal workers",
        elements: [
         {
          type: "html",
          name: "info_box_seasonalworkers",
          html: {
           default: "<br><b>Instructions:</b><hr>In this section, please enter the number of fixed-term and sub-contracted workers hired by your organization that are also seasonal workers. A <b>seasonal worker</b> is a worker that provides labour during certain seasons, usually during harvesting. Seasonal workers may be directly employed (usually as a fixed-term worker) or sub-contracted. Please also enter the number of seasonal women and men your organization employs, if this information is known.",
           es: "<br><b>Instrucciones:</b><hr>en esta sección, ingrese el número de trabajadores(as) a término fijo y subcontratados(as) que tiene contratados su organización y que sean también trabajadores(as) estacionales. Un(a) <b>trabajador(a) estacional</b> es un(a) trabajador(a) que proporciona mano de obra durante determinadas estaciones, por lo general durante la cosecha. Los(as) trabajadores(as) estacionales pueden estar empleados directamente (por lo general como trabajador a término fijo) o subcontratados. También ingrese el número de mujeres y hombres estacionales que emplea su organización si conoce esta información.",
           fr: "<br><b>Instructions :</b><hr>Dans cette section, veuillez entrer le nombre de travailleurs/euses à durée déterminée et en contrat de sous traitance employés/ées par votre organisation qui sont également des travailleurs/euses saisonniers/ières.  Un/une <b>travailleur/euse saisonnier/ière</b> est une personne qui travaille à certaines périodes, généralement les périodes de récolte. Les travailleurs/euses saisonniers/ères peuvent être employés/ées directement (habituellement à durée déterminée) ou sous contrat de sous-traitance. Veuillez également indiquer le nombre de travailleurs/euses saisonniers/ères que votre organisation emploie, si cette information est connue.",
           pt: "<br><b>Instruções:</b><hr>Nesta seção, favor informar o número de trabalhadores(as) contratados a termo fixo e subcontratados(as) por sua organização que também são trabalhadores(as) sazonais. Um(a) <b>trabalhador(a) sazonal</b> é um(a) trabalhador(a) que fornece mão-de-obra durante determinadas épocas, geralmente durante a colheita. Trabalhadores(as) sazonais podem ser empregados diretamente (geralmente como um trabalhador contratado a termo certo) ou subcontratados. Por favor, digite também o número de mulheres e homens sazonais que sua organização emprega, se esta informação for conhecida."
          }
         },
         {
          type: "html",
          name: "info_box_spo_only",
          visibleIf: "{producer_setup} = 'spo'",
          html: {
           default: "<br>This section applies <b>only to those workers hired by your organization directly.</b> Workers hired by individual members that work on farms should <i>not</i> be counted in this section.",
           es: "<br>Esta sección aplica <b>solamente para aquellos trabajadores(as) contratados por su organización de manera directa.</b> Los(as) trabajadores(as) contratados por miembros individuales que trabajan en las granjas <i>no</i> deben contarse en esta sección.",
           fr: "<br>Cette section s’applique <b>uniquement aux travailleurs/euses embauchés/ées directement par votre organisation.</b> Les travailleurs/euses embauchés/ées par des membres spécifiques qui travaillent dans les plantations ne doivent <i>pas</i> être comptés/ées dans cette section",
           pt: "<br>Esta seção se aplica <b>somente para aqueles trabalhadores(as) contratados diretamente por sua organização.</b> Trabalhadores(as) contratados por membros individuais que trabalham em fazendas <i>não</i> devem ser contados nesta seção."
          }
         }
        ]
       },
       {
        type: "panel",
        name: "workers_seasonal_panel",
        elements: [
         {
          type: "html",
          name: "workers_seasonal_max_html",
          html: {
           default: "<br>You entered that your organization employs <b>{workers_seasonal_max_hidden}</b> fixed-term and sub-contracted workers. Of these how many are seasonally employed?",
           es: "<br>Usted ingresó que su organización emplea a <b>{workers_seasonal_max_hidden}</b> trabajadores(as) de término fijo y subcontratados. De estos, ¿cuántos son empleados estacionales?",
           fr: "<br>Vous avez indiqué que votre organisation emploie <b>{workers_seasonal_max_hidden}</b> travailleurs/euses à durée déterminée et sous contrat de sous-traitance. Parmi ces personnes, combien sont employées de façon saisonnière ?",
           pt: "<br>Você informou que sua organização emprega <b>{workers_seasonal_max_hidden}</b> trabalhadores(as) a termo certo e subcontratados. Destes, quantos são empregados sazonais?"
          }
         },
         {
          type: "text",
          name: "workers_seasonal_total",
          title: {
           default: "Total seasonal workers:",
           es: "Trabajadores(as) estacionales totales:",
           fr: "Total des travailleurs/euses saisonniers/ères :",
           pt: "Total de trabalhadores(as) sazonais:"
          },
          hideNumber: true,
          validators: [
           {
            type: "numeric",
            text: {
             default: "Please enter a valid number.",
             es: "Ingrese un número válido.",
             fr: "Veuillez entrer un nombre valide.",
             pt: "Por favor, digite um número válido."
            }
           },
           {
            type: "expression",
            text: {
             default: "The sum of male and female seasonal workers is greater than the total. Please correct the error.",
             es: "La suma de los trabajadores estacionales, tanto hombres como mujeres, es mayor que el total. Corrija este error.",
             fr: "La somme des travailleurs/euses saisonniers/ères est supérieure au total. Veuillez corriger l'erreur.",
             pt: "A soma de homens e mulheres trabalhadores sazonais é maior do que o total. Por favor, corrija o erro."
            },
            expression: "{workers_seasonal_total} >= {workers_seasonal_female}+{workers_seasonal_male} OR {workers_seasonal_total} empty"
           },
           {
            type: "expression",
            text: {
             default: "The number of seasonal workers reported is greater than the number of fixed-term and sub-contracted workers. Please correct the error.",
             es: "El número de trabajadores(as) estacionales reportados es mayor que el número de trabajadores(as) a término fijo y subcontratados. Corrija este error.",
             fr: "Le nombre de travailleurs/euses saisonniers/ères rapporté est supérieur au nombre de travailleurs/euses à durée déterminée et en contrat de sous-traitance. Veuillez corriger l'erreur.",
             pt: "O número de trabalhadores(as) sazonais relatado é maior do que o número de trabalhadores(as) a termo fixo e subcontratados. Por favor, corrija o erro."
            },
            expression: "{workers_seasonal_total} <= {workers_fixed_term_total}+{workers_subcontractor_total} OR {workers_seasonal_total} empty"
           }
          ]
         },
         {
          type: "text",
          name: "workers_seasonal_female",
          visibleIf: "{workers_seasonal_gender_not_known} empty",
          title: {
           default: "Number of female seasonal workers:",
           es: "Número de trabajadoras estacionales:",
           fr: "Nombre de travailleuses saisonnières :",
           pt: "Número de trabalhadores femininos sazonais:"
          },
          hideNumber: true,
          validators: [
           {
            type: "numeric",
            text: {
             default: "Please enter a valid number.",
             es: "Ingrese un número válido.",
             fr: "Veuillez entrer un nombre valide.",
             pt: "Por favor, digite um número válido."
            }
           },
           {
            type: "expression",
            text: {
             default: "The number of seasonal female workers reported is greater than the number of fixed-term and sub-contracted female workers. Please correct the error.",
             es: "El número de trabajadoras estacionales reportadas es mayor que el número de trabajadoras a término fijo y subcontratadas. Corrija este error.",
             fr: "Le nombre de travailleuses saisonnières rapporté est supérieur au nombre de travailleuses à durée déterminée et en contrat de sous-traitance. Veuillez corriger l'erreur.",
             pt: "O número de trabalhadores sazonais relatado é maior do que o número de trabalhadores a termo fixo e subcontratados. Por favor, corrija o erro."
            },
            expression: "{workers_seasonal_female} <= {workers_fixed_term_female}+{workers_subcontractor_female} OR {workers_seasonal_female} empty"
           }
          ]
         },
         {
          type: "text",
          name: "workers_seasonal_male",
          visibleIf: "{workers_seasonal_gender_not_known} empty",
          startWithNewLine: false,
          title: {
           default: "Number of male seasonal workers:",
           es: "Número de trabajadores estacionales hombres:",
           fr: "Nombre de travailleurs saisonniers :",
           pt: "Número de trabalhadores masculinos sazonais:"
          },
          hideNumber: true,
          validators: [
           {
            type: "numeric",
            text: {
             default: "Please enter a valid number.",
             es: "Ingrese un número válido.",
             fr: "Veuillez entrer un nombre valide.",
             pt: "Por favor, digite um número válido."
            }
           },
           {
            type: "expression",
            text: {
             default: "The number of seasonal male workers reported is greater than the number of fixed-term and sub-contracted male workers. Please correct the error.",
             es: "El número de trabajadores estacionales hombres reportados es mayor que el número de trabajadores a término fijo y subcontratados. Corrija este error.",
             fr: "Le nombre de travailleurs saisonnier rapporté est supérieur au nombre de travailleurs à durée déterminée et en contrat de sous-traitance. Veuillez corriger l'erreur.",
             pt: "O número de trabalhadores masculinos sazonais relatado é maior do que o número de trabalhadores masculinos a termo fixo e subcontratados. Por favor, corrija o erro."
            },
            expression: "{workers_seasonal_male} <= {workers_fixed_term_male}+{workers_subcontractor_male} OR {workers_seasonal_male} empty"
           }
          ]
         },
         {
          type: "html",
          name: "warning_fixed_seasonal_sum",
          visibleIf: "{workers_seasonal_total} > {workers_seasonal_female}+{workers_seasonal_male} AND {workers_seasonal_female} notempty AND {workers_seasonal_male} notempty",
          html: {
           default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of male and female seasonal workers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>",
           es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de trabajadores y trabajadoras subcontratadas es menor que el total. Revise nuevamente que los números reportados sean correctos antes de continuar.</span>\n</div>",
           fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des travailleurs/euses saisonniers/ères est inférieure au total. Veuillez vérifier que les chiffres rapportés sont corrects avant de continuer.</span>\n</div>",
           pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3> <span style=\"font-size: medium;\">A soma de homens e mulheres trabalhadores subcontradados é menor do que o total. Favor verificar duas vezes se os números informados estão corretos antes de seguir em frente.</span> </div>"
          }
         },
         {
          type: "checkbox",
          name: "workers_seasonal_gender_not_known",
          titleLocation: "hidden",
          hideNumber: true,
          choices: [
           {
            value: "not_known",
            text: {
             default: "Please check here if you do not know the number of seasonal workers by gender",
             es: "Ponga una marca aquí si no conoce el número de trabajadores(as) estacionales por género",
             fr: "Veuillez vérifier ici si vous ne connaissez pas le nombre de travailleurs/euses saisonniers/ères (par sexe)",
             pt: "Favor verificar aqui se você não sabe o número de trabalhadores(as) sazonais por gênero"
            }
           }
          ]
         }
        ],
        title: {
         default: "Seasonal workers employed by your organization",
         es: "Trabajadores(as) estacionales empleados por su organización",
         fr: "Travailleurs/euses saisonniers/ères employés/ées par votre organisation",
         pt: "Trabalhadores(as) sazonais empregados por sua organização"
        }
       },
       {
        type: "text",
        name: "seasonal_workers_page_comments",
        title: {
         default: "Optional space for comments:",
         es: "Espacio opcional para comentarios:",
         fr: "Espace facultatif pour les commentaires :",
         pt: "Espaço opcional para comentários:"
        },
        hideNumber: true
       }
      ],
      visibleIf: "{consent_to_participate} = 'consent'",
      title: {
       default: "Number of workers employed by your organization",
       es: "Número de trabajadores(as) empleados por su organización",
       fr: "Nombre de travailleurs/euses employés/ées par votre organisation",
       pt: "Número de trabalhadores(as) empregados por sua organização"
      },
      navigationTitle: {
       default: "Workers",
       es: "Trabajadores(as)",
       fr: "Travailleurs/euses",
       pt: "Trabalhadores(as)"
      }
     },
     {
      name: "Young people (HL)",
      elements: [
       {
        type: "panel",
        name: "instructions_workers_by_age",
        elements: [
         {
          type: "html",
          name: "info_box_youth",
          html: {
           default: "<br>One of the most important pieces of information that Fairtrade stakeholders and consumers are interested in is how many male and female farmers and workers are part of the global Fairtrade community and benefit from Fairtrade certification. We are also trying to better understand the engagement of young people in Fairtrade organizations.",
           es: "<br>Una de las piezas más importantes de información que interesa a los interesados de Fairtrade y los consumidores es cuántos agricultores(as) y trabajadores(as), tanto hombres como mujeres, forman parte de la comunidad mundial de Fairtrade y se benefician de la certificación Fairtrade. También estamos intentando comprender mejor la participación de los(as) jóvenes en organizaciones de Fairtrade.",
           fr: "<br>L'une des informations les plus importantes qui intéressent les parties prenantes et les consommateurs du commerce équitable est le nombre d'agriculteurs/rices et de travailleurs/euses faisant partie de la communauté mondiale Fairtrade et bénéficiant de la certification Fairtrade. Nous essayons également de mieux comprendre l'engagement des jeunes dans les organisations Fairtrade.",
           pt: "<br>Uma das informações mais importantes nas quais as partes interessadas e os consumidores do Fairtrade querem saber quantos homens e mulheres fazendeiros(as) e trabalhadores(as) fazem parte da comunidade global do Fairtrade e se beneficiam da certificação do Fairtrade. Também estamos tentando entender melhor o engajamento dos(as) jovens nas organizações Fairtrade."
          }
         },
         {
          type: "html",
          name: "info_box_numberworkers_byage",
          html: {
           default: "<br><b>Instructions:</b><hr>In this section, please enter the number of workers employed by your organization, according to the following age groups:<ul><li>16 to 28 years old</li><li>29 to 35 years old</li><li>36 years and older</li></ul>If you know the number of workers for some age groups but not all, please fill in the fields that you know and leave the rest blank. If you do not know this information for any and all of the age groups, please check the box below and proceed to the next page.<br><br><i>If exact numbers are not known, estimates or minimum amounts are ok, as long as the numbers entered here are not greater than the number of workers entered on the previous page. Please also enter the number of women and men in each age group, if this information is known or can be reasonably estimated.</i>",
           es: "<br><b>Instrucciones:</b><hr>en esta sección, ingrese el número de trabajadores(as) que son miembros de su organización, de acuerdo con los grupos etarios siguientes:<ul><li>16 a 28 años</li><li>29 a 35 años</li><li>36 años y más</li></ul>Si usted conoce el número de miembros para algunos grupos etarios, pero no todos, llene los campos que conoce y deje en blanco el resto. Si usted no conoce esta información para cualquiera o ninguno de los grupos etarios, ponga una marca en el cuadro siguiente y continúe a la página siguiente.<br><br><i>Si no se conocen número exactos, está bien si da cálculos o montos mínimos siempre y cuando los números que ingrese aquí no sean mayores que el número de trabajadores(as) ingresados en la página previa. También ingrese el número de mujeres y hombres en cada grupo etario si esta información es conocida y puede calcularse de manera razonable.</i>",
           fr: "<br><b>Instructions :</b><hr>Dans cette section, veuillez indiquer le nombre de travailleurs/euses employés/ées de votre organisation, selon les groupes d'âge suivants :<ul><li>de 16 à 28 ans</li><li>de 29  à 35</li><li> de 36 ans et plus</li></ul>Si vous connaissez le nombre de travailleurs/euses pour certains groupes d'âge mais pas tous, veuillez remplir les champs que vous connaissez et laisser le reste vide. Si vous ne connaissez pas cette information pour l'un ou l'autre des groupes d'âge, veuillez cocher la case ci-dessous et passer à la page suivante.<br><br><i>Si les chiffres exacts ne sont pas connus, les estimations ou les montants minimaux sont acceptables, à condition que les chiffres rapportés ici ne soient pas supérieurs au nombre de travailleurs/euses rapporté à la page précédente. Veuillez également indiquer le nombre de femmes et d'hommes dans chaque groupe d'âge, si cette information est connue ou peut être estimée de façon raisonnable.</i>",
           pt: "<br><b>Instruções:</b><hr>Nesta seção, favor informar o número de trabalhadores(as) empregados por sua organização, de acordo com as seguintes faixas etárias::<ul><li>16 a 28 anos de idade</li><li>29 a 35 anos de idade</li><li>36 anos ou mais</li></ul>Se você sabe o número de membros para algumas das faixas etárias, mas não todos, preencha os campos que você conhece e deixe o resto em branco. Se você não souber destas informações sobre qualquer um e todos os grupos etários, marque a caixa abaixo e prossiga para a página seguinte.<br><br><i>Se os números exatos não forem conhecidos, estimativas ou valores mínimos estão ok, desde que os números inseridos aqui não sejam maiores do que o número de trabalhadores(as) inseridos na página anterior. Por favor, informe também o número de mulheres e homens em cada faixa etária, se estas informações são conhecidas ou podem ser razoavelmente estimadas.</i>"
          }
         }
        ]
       },
       {
        type: "checkbox",
        name: "workers_age_not_known",
        title: {
         default: "Do you know the number of workers hired by your organization by age groups?",
         es: "¿Conoce usted el número de trabajadores(as) de su organización por grupo etario?",
         fr: "Connaissez-vous le nombre de travailleurs embauchés par votre organisation par groupe d'âge ?",
         pt: "Você sabe o número de trabalhadores(as) contratados de sua organização por faixa etária?"
        },
        titleLocation: "hidden",
        hideNumber: true,
        choices: [
         {
          value: "not_known",
          text: {
           default: "Please check here if you do not know the number of workers employed by your organization for any of the specified age groups",
           es: "Ponga una marca aquí si no conoce el número de trabajadores(as) empleados por su organización para cualesquiera de los grupos etarios especificados",
           fr: "Veuillez vérifier ici si vous ne connaissez pas le nombre de travailleurs/euses employés/ées par votre organisation pour l'un des groupes d'âge spécifiés",
           pt: "Por favor, marque aqui se você não souber o número de trabalhadores(as) empregados pela sua organização para qualquer uma das faixas etárias especificadas."
          }
         }
        ]
       },
       {
        type: "panel",
        name: "Number of workers by age",
        elements: [
         {
          type: "panel",
          name: "panel_workers_16_28",
          elements: [
           {
            type: "html",
            name: "info_box_workers_16_28",
            html: {
             default: "<br><b>Workers 16 to 28 years old</b>",
             es: "<br><b> Trabajadores(as) de 16 a 28 años de edad</b>",
             fr: "<br><b>Travailleurs/euses de 16 à 28 ans </b>",
             pt: "<br><b>Trabalhadores(as) de 16 a 28 anos de idade</b>"
            }
           },
           {
            type: "text",
            name: "total_workers_16_28",
            title: {
             default: "Total workers:",
             es: "Trabajadores(as) totales:",
             fr: "Total des travailleurs :",
             pt: "Total de trabalhadores(as):"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             },
             {
              type: "expression",
              text: {
               default: "The sum of male and female workers is greater than the total. Please correct the error.",
               es: "La suma de los trabajadores, tanto hombres como mujeres, es mayor que el total. Corrija este error.",
               fr: "La somme des travailleurs et des travailleuses est supérieure au total. Veuillez corriger l'erreur.",
               pt: "A soma de homens e mulheres trabalhadores é maior do que o total. Por favor, corrija o erro."
              },
              expression: "{total_workers_16_28} >= {workers_female_16_28}+{workers_male_16_28} OR {total_workers_16_28} empty"
             },
             {
              type: "expression",
              text: {
               default: "The sum of workers by age group is greater than the total reported on the previous page. Please correct the error.",
               es: "La suma de trabajadores(as) por grupo etario es mayor que el total reportado en la página previa. Corrija este error.",
               fr: "La somme des travailleurs par groupe d'âge est supérieure au total rapporté à la page précédente. Veuillez corriger l'erreur.",
               pt: "A soma dos trabalhadores(as) por faixa etária é maior do que o total relatado na página anterior. Por favor, corrija o erro."
              },
              expression: "{RO_workers_age_total} <= {workers_total} OR {total_workers_16_28} empty"
             }
            ]
           },
           {
            type: "text",
            name: "workers_female_16_28",
            visibleIf: "{workers_gender_not_known_16_28} empty",
            title: {
             default: "Number of female workers:",
             es: "Número de trabajadoras:",
             fr: "Nombre de travailleuses :",
             pt: "Número de trabalhadores femininos:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "text",
            name: "workers_male_16_28",
            visibleIf: "{workers_gender_not_known_16_28} empty",
            startWithNewLine: false,
            title: {
             default: "Number of male workers:",
             es: "Número de trabajadores hombres:",
             fr: "Nombre de travailleurs :",
             pt: "Número de trabalhadores masculinos:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "html",
            name: "warning_workers_16to28_sum",
            visibleIf: "{total_workers_16_28} > {workers_female_16_28}+{workers_male_16_28} AND {workers_female_16_28} notempty AND {workers_male_16_28} notempty",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of male and female workers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de trabajadores, tanto hombres como mujeres, es menor que el total. Revise nuevamente que los números reportados sean correctos antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des travailleurs/euses est inférieure au total. Veuillez vérifier que les chiffres rapportés sont corrects avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3> <span style=\"font-size: medium;\">A soma de homens e mulheres trabalhadores é menor do que o total. Favor verificar duas vezes se os números informados estão corretos antes de seguir em frente.</span> </div>"
            }
           },
           {
            type: "checkbox",
            name: "workers_gender_not_known_16_28",
            titleLocation: "hidden",
            hideNumber: true,
            choices: [
             {
              value: "not_known",
              text: {
               default: "Please check here if you do not know the number of workers age 16 to 28 years by gender",
               es: "Ponga una marca aquí si no conoce el número de trabajadores(as) de 16 a 28 años de edad por género",
               fr: "Veuillez vérifier ici si vous ne connaissez pas le nombre de travailleurs/euses de 16 à 28 ans (par sexe)",
               pt: "Favor verificar aqui se você não sabe o número de trabalhadores(as) de 16 a 28 anos de idade por gênero"
              }
             }
            ]
           }
          ]
         },
         {
          type: "panel",
          name: "panel_workers_29_35",
          elements: [
           {
            type: "html",
            name: "info_box_workers_29_35",
            html: {
             default: "<br><b>Workers 29 to 35 years old</b>",
             es: "<br><b> Trabajadores(as) de 29 a 35 años de edad</b>",
             fr: "<br><b>Travailleurs/euses de 29 à 35 ans </b>",
             pt: "<br><b>Trabalhadores(as) de 29 a 35 anos de idade</b>"
            }
           },
           {
            type: "text",
            name: "total_workers_29_35",
            title: {
             default: "Total workers:",
             es: "Trabajadores(as) totales:",
             fr: "Total des travailleurs :",
             pt: "Total de trabalhadores(as):"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             },
             {
              type: "expression",
              text: {
               default: "The sum of male and female workers is greater than the total. Please correct the error.",
               es: "La suma de los trabajadores, tanto hombres como mujeres, es mayor que el total. Corrija este error.",
               fr: "La somme des travailleurs et des travailleuses est supérieure au total. Veuillez corriger l'erreur.",
               pt: "A soma de homens e mulheres trabalhadores é maior do que o total. Por favor, corrija o erro."
              },
              expression: "{total_workers_29_35} >= {workers_female_29_35}+{workers_male_29_35} OR {total_workers_29_35} empty"
             },
             {
              type: "expression",
              text: {
               default: "The sum of workers by age group is greater than the total reported on the previous page. Please correct the error.",
               es: "La suma de trabajadores(as) por grupo etario es mayor que el total reportado en la página previa. Corrija este error.",
               fr: "La somme des travailleurs par groupe d'âge est supérieure au total rapporté à la page précédente. Veuillez corriger l'erreur.",
               pt: "A soma dos trabalhadores(as) por faixa etária é maior do que o total relatado na página anterior. Por favor, corrija o erro."
              },
              expression: "{RO_workers_age_total} <= {workers_total} OR {total_workers_29_35} empty"
             }
            ]
           },
           {
            type: "text",
            name: "workers_female_29_35",
            visibleIf: "{workers_gender_not_known_29_35} empty",
            title: {
             default: "Number of female workers:",
             es: "Número de trabajadoras:",
             fr: "Nombre de travailleuses :",
             pt: "Número de trabalhadores femininos:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "text",
            name: "workers_male_29_35",
            visibleIf: "{workers_gender_not_known_29_35} empty",
            startWithNewLine: false,
            title: {
             default: "Number of male workers:",
             es: "Número de trabajadores hombres:",
             fr: "Nombre de travailleurs :",
             pt: "Número de trabalhadores masculinos:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "html",
            name: "warning_workers_29to35_sum",
            visibleIf: "{total_workers_29_35} > {workers_female_29_35}+{workers_male_29_35} AND {workers_female_29_35} notempty AND {workers_male_29_35} notempty",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of male and female workers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de trabajadores, tanto hombres como mujeres, es menor que el total. Revise nuevamente que los números reportados sean correctos antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des travailleurs/euses est inférieure au total. Veuillez vérifier que les chiffres rapportés sont corrects avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3> <span style=\"font-size: medium;\">A soma de homens e mulheres trabalhadores é menor do que o total. Favor verificar duas vezes se os números informados estão corretos antes de seguir em frente.</span> </div>"
            }
           },
           {
            type: "checkbox",
            name: "workers_gender_not_known_29_35",
            titleLocation: "hidden",
            hideNumber: true,
            choices: [
             {
              value: "not_known",
              text: {
               default: "Please check here if you do not know the number of workers age 29 to 35 years by gender",
               es: "Ponga una marca aquí si no conoce el número de trabajadores(as) de 29 a 35 años de edad por género",
               fr: "Veuillez vérifier ici si vous ne connaissez pas le nombre de travailleurs/euses de 29 à 35 ans (par sexe)",
               pt: "Favor verificar aqui se você não sabe o número de trabalhadores(as) de 29 a 35 anos de idade por gênero"
              }
             }
            ]
           }
          ]
         },
         {
          type: "panel",
          name: "panel_workers_36",
          elements: [
           {
            type: "html",
            name: "info_box_workers_36",
            html: {
             default: "<br><b>Workers 36 years and older</b>",
             es: "<br><b> Trabajadores(as) de 36 años o más</b>",
             fr: "<br><b>Travailleurs/euses de 36 ans et plus</b>",
             pt: "<br><b>Trabalhadores(as) de 36 anos de idade ou mais velhos</b>"
            }
           },
           {
            type: "text",
            name: "total_workers_36",
            title: {
             default: "Total workers:",
             es: "Trabajadores(as) totales:",
             fr: "Total des travailleurs :",
             pt: "Total de trabalhadores(as):"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             },
             {
              type: "expression",
              text: {
               default: "The sum of male and female workers is greater than the total. Please correct the error.",
               es: "La suma de los trabajadores, tanto hombres como mujeres, es mayor que el total. Corrija este error.",
               fr: "La somme des travailleurs et des travailleuses est supérieure au total. Veuillez corriger l'erreur.",
               pt: "A soma de homens e mulheres trabalhadores é maior do que o total. Por favor, corrija o erro."
              },
              expression: "{total_workers_36} >= {workers_female_36}+{workers_male_36} OR {total_workers_36} empty"
             },
             {
              type: "expression",
              text: {
               default: "The sum of workers by age group is greater than the total reported on the previous page. Please correct the error.",
               es: "La suma de trabajadores(as) por grupo etario es mayor que el total reportado en la página previa. Corrija este error.",
               fr: "La somme des travailleurs par groupe d'âge est supérieure au total rapporté à la page précédente. Veuillez corriger l'erreur.",
               pt: "A soma dos trabalhadores(as) por faixa etária é maior do que o total relatado na página anterior. Por favor, corrija o erro."
              },
              expression: "{RO_workers_age_total} <= {workers_total} OR {total_workers_36} empty"
             }
            ]
           },
           {
            type: "text",
            name: "workers_female_36",
            visibleIf: "{workers_gender_not_known_36} empty",
            title: {
             default: "Number of female workers:",
             es: "Número de trabajadoras:",
             fr: "Nombre de travailleuses :",
             pt: "Número de trabalhadores femininos:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "text",
            name: "workers_male_36",
            visibleIf: "{workers_gender_not_known_36} empty",
            startWithNewLine: false,
            title: {
             default: "Number of male workers:",
             es: "Número de trabajadores hombres:",
             fr: "Nombre de travailleurs :",
             pt: "Número de trabalhadores masculinos:"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             }
            ]
           },
           {
            type: "html",
            name: "warning_workers_36_sum",
            visibleIf: "{total_workers_36} > {workers_female_36}+{workers_male_36} AND {workers_female_36} notempty AND {workers_male_36} notempty",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of male and female workers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de trabajadores, tanto hombres como mujeres, es menor que el total. Revise nuevamente que los números reportados sean correctos antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des travailleurs/euses est inférieure au total. Veuillez vérifier que les chiffres rapportés sont corrects avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3> <span style=\"font-size: medium;\">A soma de homens e mulheres trabalhadores é menor do que o total. Favor verificar duas vezes se os números informados estão corretos antes de seguir em frente.</span> </div>"
            }
           },
           {
            type: "checkbox",
            name: "workers_gender_not_known_36",
            titleLocation: "hidden",
            choices: [
             {
              value: "not_known",
              text: {
               default: "Please check here if you do not know the number of workers 36 years and older by gender",
               es: "Ponga una marca aquí si no conoce el número de trabajadores(as) de 36 años o más por género",
               fr: "Veuillez vérifier ici si vous ne connaissez pas le nombre de travailleurs/euses de 36 ans et plus (par sexe)",
               pt: "Favor verificar aqui se você não sabe o número de trabalhadores(as) de 36 anos de idade ou mais por gênero"
              }
             }
            ]
           }
          ]
         }
        ],
        visibleIf: "{workers_age_not_known} empty"
       },
       {
        type: "text",
        name: "workers_age_page_comments",
        visibleIf: "{workers_age_not_known} empty",
        title: {
         default: "Optional space for comments:",
         es: "Espacio opcional para comentarios:",
         fr: "Espace facultatif pour les commentaires :",
         pt: "Espaço opcional para comentários:"
        },
        hideNumber: true
       },
       {
        type: "panel",
        name: "Summary of workers reported",
        elements: [
         {
          type: "panel",
          name: "workers_total_summary_byage",
          elements: [
           {
            type: "expression",
            name: "RO_workers_age_total",
            title: {
             default: "Number of workers reported in an age group:",
             es: "Número de trabajadores(as) reportados en un grupo etario:",
             fr: "Nombre de travailleurs/euses rapporté dans un groupe d'âge :",
             pt: "Número de trabalhadores(as) relatados em uma faixa etária:"
            },
            hideNumber: true,
            expression: "{total_workers_16_28}+{total_workers_29_35}+{total_workers_36}",
            displayStyle: "decimal"
           },
           {
            type: "expression",
            name: "RO_workers_age_unknown",
            startWithNewLine: false,
            title: {
             default: "Number of workers (age unknown):",
             es: "Número de trabajadores(as) (edad desconocida):",
             fr: "Nombre de travailleurs/euses (âge inconnu) :",
             pt: "Número de trabalhadores(as) (idade desconhecida):"
            },
            hideNumber: true,
            expression: "{workers_total}-{RO_workers_age_total}",
            displayStyle: "decimal"
           },
           {
            type: "html",
            name: "warning_workers_byage_sum",
            visibleIf: "{workers_total} > {RO_workers_age_total}",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of workers by age group is less than the total reported on the previous page. Please double check that the numbers reported are correct before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de trabajadores por grupo etario es menor que el total reportado en la página previa. Revise nuevamente que los números reportados sean correctos antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des travailleurs/euses par groupe d’âge est inférieure au total rapporté à la page précédente. Veuillez vérifier que les chiffres rapportés sont corrects avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3> <span style=\"font-size: medium;\">A soma de trabalhadores por faixa etária é menor que o total relatado nas páginas anteriores. Favor verificar duas vezes se os números informados estão corretos antes de seguir em frente.</span> </div>"
            }
           },
           {
            type: "html",
            name: "warning_workers_total_byage",
            visibleIf: "{RO_workers_age_total} > {workers_total}",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of workers by age group is greater than the total reported on the previous page. Please correct the error before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de trabajadores por grupo etario es mayor que el total reportado en la página previa. Corrija el error antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des travailleurs/euses par groupe d’âge est supérieure au total rapporté à la page précédente. Veuillez corriger l’erreur avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3> <span style=\"font-size: medium;\">A soma de trabalhadores por faixa etária é maior que o total relatado nas páginas anteriores. Favor corrigir o erro antes de seguir em frente.</span> </div>"
            }
           }
          ],
          title: {
           default: "Total number of workers employed by your organization: {workers_total}",
           es: "Número total de trabajadores(as) empleados por su organización: {workers_total}",
           fr: "Nombre total de travailleurs/euses employés/ées par votre organisation : {workers_total}",
           pt: "Número total de trabalhadores(as) empregados por sua organização {workers_total}"
          }
         },
         {
          type: "panel",
          name: "workers_female_summary_byage",
          elements: [
           {
            type: "expression",
            name: "RO_workers_age_female_total",
            title: {
             default: "Number of female workers reported in an age group:",
             es: "Número de trabajadoras reportadas en un grupo etario:",
             fr: "Nombre de travailleuses rapportées dans un groupe d'âge :",
             pt: "Número de trabalhadores femininos relatados em uma faixa etária:"
            },
            hideNumber: true,
            expression: "{workers_female_16_28}+{workers_female_29_35}+{workers_female_36}",
            displayStyle: "decimal"
           },
           {
            type: "expression",
            name: "RO_workers_age_female_unknown",
            startWithNewLine: false,
            title: {
             default: "Number of female workers (age unknown):",
             es: "Número de trabajadoras (edad desconocida):",
             fr: "Nombre de travailleuses (âge inconnu) :",
             pt: "Número de trabalhadores femininos (idade desconhecida):"
            },
            hideNumber: true,
            expression: "{workers_female}-{RO_workers_age_female_total}",
            displayStyle: "decimal"
           },
           {
            type: "html",
            name: "warning_workers_female_byage",
            visibleIf: "{RO_workers_age_female_total} > {workers_female}",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of female workers by age group is greater than the total reported on the previous page. Please correct the error before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de trabajadoras por grupo etario es mayor que el total reportado en la página previa. Corrija el error antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des travailleuses par groupe d’âge est supérieure au total rapporté à la page précédente. Veuillez corriger l’erreur avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3> <span style=\"font-size: medium;\">A soma de trabalhadores femininos por faixa etária é maior que o total relatado nas páginas anteriores. Favor corrigir o erro antes de seguir em frente.</span> </div>"
            }
           }
          ],
          title: {
           default: "Total number of female workers employed by your organization: {workers_female}",
           es: "Número total de trabajadoras empleadas por su organización: {workers_female}",
           fr: "Nombre total de travailleuses employées par votre organisation : {Workers_women}",
           pt: "Número total de trabalhadores femininos empregados por sua organização {workers_female}"
          }
         },
         {
          type: "panel",
          name: "workers_male_summary_byage",
          elements: [
           {
            type: "expression",
            name: "RO_workers_age_male_total",
            startWithNewLine: false,
            title: {
             default: "Number of male workers reported in an age group:",
             es: "Número de trabajadores hombre reportados en un grupo etario:",
             fr: "Nombre de travailleurs rapporté dans un groupe d'âge :",
             pt: "Número de trabalhadores masculinos relatados em uma faixa etária:"
            },
            hideNumber: true,
            expression: "{workers_male_16_28}+{workers_male_29_35}+{workers_male_36}",
            displayStyle: "decimal"
           },
           {
            type: "expression",
            name: "RO_workers_age_male_unknown",
            startWithNewLine: false,
            title: {
             default: "Number of male workers (age unknown):",
             es: "Número de trabajadores hombre (edad desconocida):",
             fr: "Nombre de travailleurs (âge inconnu) :",
             pt: "Número de trabalhadores masculinos (idade desconhecida):"
            },
            hideNumber: true,
            expression: "{workers_male}-{RO_workers_age_male_total}",
            displayStyle: "decimal"
           },
           {
            type: "html",
            name: "warning_workers_male_byage",
            visibleIf: "{RO_workers_age_male_total} > {workers_male}",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of male workers by age group is greater than the total reported on the previous page. Please correct the error before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de trabajadores hombre por grupo etario es mayor que el total reportado en la página previa. Corrija el error antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des travailleurs par groupe d’âge est supérieure au total rapporté à la page précédente. Veuillez corriger l’erreur avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3> <span style=\"font-size: medium;\">A soma de trabalhadores masculinos por faixa etária é maior que o total relatado nas páginas anteriores. Favor corrigir o erro antes de seguir em frente.</span> </div>"
            }
           }
          ],
          title: {
           default: "Total number of male workers employed by your organization: {workers_male}",
           es: "Número total de trabajadores hombres empleados por su organización: {workers_male}",
           fr: "Nombre total de travailleurs employés par votre organisation : {workers_male}",
           pt: "Número total de trabalhadores masculinos empregados por sua organização {workers_male}"
          }
         }
        ],
        visibleIf: "{workers_age_not_known} empty",
        title: {
         default: "Summary number of workers reported by age group",
         es: "Número resumido de trabajadores(as) reportados por grupo etario",
         fr: "Nombre total de travailleurs/euses rapporté par groupe d'âge",
         pt: "Resumo: número de trabalhadores(as) relatados por faixa etária"
        }
       }
      ],
      visibleIf: "{producer_setup} = 'hl' AND {consent_to_participate} = 'consent'",
      title: {
       default: "Number of young people employed by your organization",
       es: "Número de jóvenes empleados(as) por su organización",
       fr: "Nombre de jeunes employés/ées par votre organisation",
       pt: "Número de jovens empregados(as) por sua organização"
      },
      navigationTitle: {
       default: "Young people",
       es: "Jóvenes",
       fr: "Les jeunes",
       pt: "Jovens"
      }
     },
     {
      name: "Total Land Area",
      elements: [
       {
        type: "panel",
        name: "instructions_landarea",
        elements: [
         {
          type: "html",
          name: "info_box_production",
          html: {
           default: "<br>Another key area of information that Fairtrade stakeholders and consumers are interested in is the production of Fairtrade certified products. This helps Fairtrade understand our producer organizations; analyse growth, yields and market potential over time; and guide our global strategy.",
           es: "<br>Otra área clave de información que interesa las partes interesadas de Fairtrade y los consumidores es la producción de productos certificados de Fairtrade. Esto ayuda a que Fairtade comprenda nuestras organizaciones productoras, analice el crecimiento, los rendimientos y el potencial de mercado con el paso del tiempo y guíe nuestra estrategia gobal.",
           fr: "<br>La production de produits certifiés Fairtrade constitue un autre domaine clé d'information auquel s'intéressent les parties prenantes et les consommateurs de Fairtrade. Cela aide Fairtrade à comprendre nos organisations de producteurs ; à analyser la croissance, les rendements et le potentiel de marché dans le temps ; et à guider notre stratégie globale.",
           pt: "<br>Outra área chave de informação em que os interessados e consumidores Fairtrade estão interessados é a produção de produtos certificados Fairtrade. Isso ajuda a compreender nossas organizações de produtores; analisar o crescimento, o rendimento e o potencial de mercado ao longo do tempo; e orientar nossa estratégia global."
          }
         },
         {
          type: "html",
          name: "info_box_landarea",
          html: {
           default: "<br><b>Instructions:</b><hr>In this section, please enter the land area managed by your organization.",
           es: "<br><b>Instrucciones:</b><hr>ingrese el el área de tierra que gestiona su organización en esta sección.",
           fr: "<br><b>Instructions :</b><hr>Dans cette section, veuillez indiquer la superficie des terres gérées par votre organisation.",
           pt: "<br><b>Instruções:</b><hr>Nesta seção, favor inserir a área de terreno administrada por sua organização."
          }
         },
         {
          type: "html",
          name: "info_box_totalarea_SPO",
          visibleIf: "{producer_setup} = 'spo'",
          html: {
           default: "<br><i>The <b>Total land area managed</b> refers to all land area managed by members of your organization and under agricultural cultivation, whether Fairtrade certified or not.</i>",
           es: "<br><i>El <b>área total de tierra gestionada</b> significa toda el área de tierra que gestionan los miembros de su organización y bajo el cultivo agrícola, ya sea certificado o no por Fairtrade.</i>",
           fr: "<br><i>La <b> superficie totale des terres géréess</b> fait référence à toutes les terres gérées par les membres de votre organisation et cultivées, qu'elles soient certifiées Fairtrade ou non.</i>",
           pt: "<br><i>A <b>área total de terra administrada</b> refere-se a toda a área de terra administrada por membros de sua organização e sob cultivo agrícola, certificada ou não pelo Fairtrade.</i>"
          }
         },
         {
          type: "html",
          name: "info_box_fairtrade_area",
          html: {
           default: "<br><i>The <b>Fairtrade certified land area</b> refers to only the area of land within your organization that is under cultivation of Fairtrade certified crops.</i>",
           es: "<br><i>El <b>área de tierra certificada por Fairtrade</b> hace referencia a solamente el área de tierra dentro de su organización que se encuentra bajo cultivos certificados por Fairtrade.</i>",
           fr: "<br><i>La <b>superficie des terres certifiées Fairtrade</b> fait référence uniquement à la superficie des terres cultivées au sein de votre organisation sous certification Fairtrade</i>",
           pt: "<br><i>A <b>área de terra certificada pelo Fairtrade</b> refere-se apenas à área de terra dentro de sua organização que está sob cultivo de culturas certificadas pelo Fairtrade.</i>"
          }
         }
        ]
       },
       {
        type: "panel",
        name: "land_area_panel",
        elements: [
         {
          type: "radiogroup",
          name: "land_area_unit",
          title: {
           default: "In what unit would you like to report your land area?",
           es: "¿En qué unidad desearía hacer su reporte de su área de tierra?",
           fr: "Dans quelle unité souhaitez-vous déclarer la superficie de vos terres ?",
           pt: "Em que unidade você gostaria de reportar sua área de terreno?"
          },
          hideNumber: true,
          isRequired: true,
          choices: [
           {
            value: "ha",
            text: {
             default: "hectares",
             es: "hectáreas",
             fr: "Hectares"
            }
           },
           {
            value: "acre",
            text: {
             default: "acres",
             fr: "Acres"
            }
           }
          ]
         },
         {
          type: "text",
          name: "total_land_managed",
          visibleIf: "{producer_setup} = 'spo'",
          title: {
           default: "Total land area managed (in {land_area_unit}):",
           es: "Área gestionada total (en {land_area_unit}):",
           fr: "Superficie totale des terres gérées {land_area_unit}) :",
           pt: "Área total de terra administrada (em {area_land_unit}):"
          },
          hideNumber: true,
          validators: [
           {
            type: "numeric",
            text: {
             default: "Please enter a valid number.",
             es: "Ingrese un número válido.",
             fr: "Veuillez entrer un nombre valide.",
             pt: "Por favor, digite um número válido."
            }
           },
           {
            type: "expression",
            text: {
             default: "A comma (,) is not allowed. Please use a dot (.) as a decimal separator.",
             es: "No se permiten comas (,). Utilice el punto (.) como separador decimal.",
             fr: "Veuillez ne pas mettre de virgule (,). Utilisez un point (.) comme séparateur décimal.",
             pt: "Uma vírgula (,) não é permitida. Favor usar um ponto (.) como separador decimal."
            },
            expression: "{total_land_managed} notcontains ','"
           },
           {
            type: "expression",
            text: {
             default: "Fairtrade land area is larger than total land area.",
             es: "El área de tierra de Fairtrade es mayor que el área de tierra total.",
             fr: "La superficie des terres Fairtrade est supérieure à la superficie totale des terres.",
             pt: "A área do terreno Fairtrade é maior do que a área total do terreno."
            },
            expression: "{total_land_managed} >= {total_area_ft_certification} OR {total_land_managed} empty OR {total_area_ft_certification} empty"
           }
          ]
         },
         {
          type: "text",
          name: "total_area_ft_certification",
          startWithNewLine: false,
          title: {
           default: "Fairtrade certified land area (in {land_area_unit}):",
           es: "Área de tierra certificada por Fairtrade (en {land_area_unit}):",
           fr: "Superficie des terres certifiées Fairtrade (en {land_area_unit}):",
           pt: "Área de terra certificada Fairtrade (em {land_area_unit}):"
          },
          hideNumber: true,
          validators: [
           {
            type: "numeric",
            text: {
             default: "Please enter a valid number.",
             es: "Ingrese un número válido.",
             fr: "Veuillez entrer un nombre valide.",
             pt: "Por favor, digite um número válido."
            }
           },
           {
            type: "expression",
            text: {
             default: "A comma (,) is not allowed. Please use a dot (.) as a decimal separator.",
             es: "No se permiten comas (,). Utilice el punto (.) como separador decimal.",
             fr: "Veuillez ne pas mettre de virgule (,). Utilisez un point (.) comme séparateur décimal.",
             pt: "Uma vírgula (,) não é permitida. Favor usar um ponto (.) como separador decimal."
            },
            expression: "{total_area_ft_certification} notcontains ','"
           }
          ]
         }
        ]
       },
       {
        type: "text",
        name: "landarea_page_comments",
        title: {
         default: "Optional space for comments:",
         es: "Espacio opcional para comentarios:",
         fr: "Espace facultatif pour les commentaires :",
         pt: "Espaço opcional para comentários:"
        },
        hideNumber: true
       }
      ],
      visibleIf: "{consent_to_participate} = 'consent'",
      title: {
       default: "Land area under cultivation by your organization",
       es: "Área de tierra bajo cultivo por nuestra organización",
       fr: "Superficie des terres cultivées par votre organisation",
       pt: "Área de terra sob cultivo por sua organização"
      },
      navigationTitle: {
       default: "Total Land Area",
       es: "Área de tierra total",
       fr: "Superficie totale des terres",
       pt: "Área total do terreno"
      }
     },
     {
      name: "product_page",
      elements: [
       {
        type: "panel",
        name: "instructions_products_page",
        elements: [
         {
          type: "html",
          name: "info_box_production",
          html: {
           default: "<br>Another key area of information that Fairtrade stakeholders and consumers are interested in is the production of Fairtrade certified products. This helps Fairtrade understand our producer organizations; analyse growth, yields and market potential over time; and guide our global strategy.<br><br>In addition, a new indicator that we want to better understand is the forecasted volumes (volumes on offer) that are of export quality and can be sold on Fairtrade terms. In the future, information like this could be used (by authorised staff at Fairtrade International and the Producer Networks) to seek new market opportunities.",
           es: "<br>Otra área clave de información que interesa las partes interesadas de Fairtrade y los consumidores es la producción de productos certificados de Fairtrade. Esto ayuda a que Fairtade comprenda nuestras organizaciones productoras, analice el crecimiento, los rendimientos y el potencial de mercado con el paso del tiempo y guíe nuestra estrategia gobal.<br><br>Adicionalmente, un indicador nuevo que deseamos comprender mejor es los volúmenes pronosticados (volúmenes en oferta) que son de calidad de exportación y pueden venderse en términos de Fairtrade. En el futuro, la información como esta puede usarse (por personal autorizado en Fairtrade International y las Redes de productores) para buscar nuevas oportunidades de mercado.",
           fr: "<br>La production de produits certifiés Fairtrade constitue un autre domaine clé d'information auquel s'intéressent les parties prenantes et les consommateurs de Fairtrade. Cela aide Fairtrade à comprendre nos organisations de producteurs ; analyser la croissance, les rendements et le potentiel de marché dans le temps ; et à guider notre stratégie globale<br><br>En outre, les volumes prévus (volumes proposés) qui sont de qualité exportable et qui peuvent être vendus conformément aux conditions de Fairtrade constituent un nouvel indicateur que nous souhaitons mieux comprendre. À l'avenir, de telles informations pourraient être utilisées (par le personnel autorisé de Fairtrade International et les réseaux de producteurs) pour rechercher de nouvelles opportunités de marché.",
           pt: "<br>Outra área chave de informação em que os interessados e consumidores Fairtrade estão interessados é a produção de produtos certificados Fairtrade. Isto ajuda a compreender nossas organizações de produtores; analisar o crescimento, o rendimento e o potencial de mercado ao longo do tempo; e orientar nossa estratégia global.<br><br>Além disso, um novo indicador que queremos entender melhor são os volumes previstos (volumes em oferta) que são de qualidade de exportação e podem ser vendidos em condições de Fairtrade. No futuro, informações como estas poderiam ser utilizadas (por pessoal autorizado da Fairtrade International e da Producer Networks) para buscar novas oportunidades de mercado."
          }
         },
         {
          type: "html",
          name: "info_box_products_page",
          html: {
           default: "<br><b>Instructions:</b><hr>In this section, please enter the land area under cultivation and volumes produced in the most recent production cycle (2021-2022) by your organization for each Fairtrade certified product. If your organization also has a forecast of the volume that will be of export quality for sale on Fairtrade terms for the upcoming production cycle (2022-2023), please also enter this information.",
           es: "<br><b>Instrucciones:</b><hr>en esta sección, ingrese el área de tierra bajo cultivo y los volúmenes producidos por su organización en el ciclo de producción más reciente (2021-2022) para cada producto certificado por Fairtrade. Si su organización tiene también un pronóstico de volumen que será de calidad de exportación para venta en los términos de Fairtrade para el ciclo de producción próximo (2022-2023), ingrese también esta información.",
           fr: "<br><b>Instructions :</b><hr>Dans cette section, veuillez indiquer la superficie de terres cultivées et les volumes produits au cours du cycle de production le plus récent (2021-2022) par votre organisation pour chaque produit certifié Fairtrade. Si votre organisation prévoit également un volume de qualité exportable pour la vente conformément aux conditions de Fairtrade pour le prochain cycle de production (2022-2023), veuillez également entrer cette information.",
           pt: "<br><b>Instruções:</b><hr>Nesta seção, favor entrar na área de cultivo e volumes produzidos no ciclo de produção mais recente (2021-2022) por sua organização para cada produto certificado Fairtrade. Se sua organização também tem uma previsão do volume que será de qualidade de exportação para venda nos termos do Fairtrade para o próximo ciclo de produção (2022-2023), por favor, digite também esta informação."
          }
         },
         {
          type: "html",
          name: "info_box_units",
          html: {
           default: "<br>Note that <u>some units should only be used for specific products</u>. For guidance on which units to use for your organization's products, please see the information box below.",
           es: "<br>Note que <u>algunas unidades solo deben usarse para productos específicos</u>. Vea el cuadro informativo siguiente para obtener indicaciones sobre qué unidades usar para los productos de su organización.",
           fr: "<br>Veuillez noter que <u>certaines unités doivent être utilisées uniquement pour des produits spécifiques</u>. Pour obtenir des conseils sur les unités à utiliser pour les produits de votre organisation, veuillez consulter la boîte d'information ci-dessous.",
           pt: "<br>Observe que <u>algumas unidades só devem ser usadas para produtos específicos</u>. Para orientação sobre quais unidades usar para os produtos de sua organização, consulte a caixa de informações abaixo."
          }
         },
         {
          type: "html",
          name: "info_box_navigation",
          html: {
           default: "<br>How to enter information about your organization's Fairtrade certified products:<i><ul><li>Enter the information for each product one at a time. To start reporting on your first product, select the 'Add product' botton.</li><li>From the dropdown list, select the product. Note, the first dropdown list helps you to narrow down your search by product category (ex: coffee, vegetables). Once selected, a second dropdown list will appear from which you can select the product.</li><li>Proceed to enter the land area, volumes produced and forecast volumes for your first product.</li><li>When you reach the bottom of the page, you have the option to add additional products by selecting the 'Add product' button. You can add as many Fairtrade products as needed.</li><li>Proceed to enter the information for the rest of your Fairtrade products.</li><li>Go back to the previous or next product by using the navigation buttons at the bottom of the page.</li><li>To remove all information about a product, select 'Remove this product' at the bottom of the page.</li></ul></i>",
           es: "<br>Cómo ingresar información acerca de los productos de su organización certificados por Fairtrade:<i><ul><li>ingrese la información para cada producto, uno a la vez. Para comenzar a reportar su primer producto, seleccione el botón “Agregar producto”.</li><li>De la lista desplegable, seleccione el producto. Note que la primera lista desplegable le ayuda a reducir su búsqueda por categoría de producto (por ej., café, vegetales). Una vez seleccionada, aparecerá una segunda lista desplegable a partir de la cual puede seleccionar el producto.</li><li>Continúe para ingresar el área de tierra, los volúmenes producidos y los volúmenes pronosticados para su primer producto.</li><li>Cuando alcance el fondo de la página, tendrá la opción de agegar productos adicionales seleccionando el botón “Agregar producto”. Puede agregar tantos productos de Faritrade como necesite.</li><li>Siga ingresando la información para el resto de sus productos de Fairtrade.</li><li>Vuelva al producto previo o siguiente usando los botones de navegación al fondo de la página.</li><li>Para remover toda la información sobre un producto, seleccione “Remover este producto” en la parte inferior de la página.</li></ul></i>",
           fr: "<br>Comment entrer des informations sur les produits certifiés Fairtrade de votre organisation :<i><ul><li>Entrez les informations pour chaque produit un par un.  Pour commencer à rapporter les informations sur votre premier produit, veuillez sélectionner le bouton « Ajouter un produit  ».</li><li>À partir de la liste déroulante, veuillez sélectionner le produit. Notez que la première liste déroulante vous aide à affiner votre recherche par catégorie de produit (ex : café, légumes). Une fois sélectionné, une deuxième liste déroulante s’affiche dans laquelle vous pouvez sélectionner le produit.</li><li>Passez à la superficie des terres, aux volumes produits et aux volumes prévus pour votre premier produit.</li><li>Une fois atteint le bas de la page, vous avez la possibilité d'ajouter des produits supplémentaires en sélectionnant le bouton « Ajouter un produit ». Vous pouvez ajouter autant de produits Fairtrade que nécessaire.</li><li>Passez à la saisie des informations pour le reste de vos produits Fairtrade.</li><li>Retournez au produit précédent ou suivant en utilisant les boutons de navigation au bas de la page.</li><li>Pour supprimer toutes les informations sur un produit, sélectionnez « Supprimer ce produit » au bas de la page.</li></ul></i>",
           pt: "<br>Como inserir informações sobre os produtos certificados Fairtrade de sua organização:<i><ul><li>Insira as informações para cada produto, uma de cada vez. Para começar a informar sobre seu primeiro produto, selecione o botão 'Adicionar produto'.</li><li> A partir da lista suspensa, selecione o produto. Observe que a primeira lista suspensa ajuda você a restringir sua busca por categoria de produto (ex: café, legumes). Uma vez selecionada, aparecerá uma segunda lista suspensa da qual você poderá selecionar o produto.</li><li>Continue inserindo a área do terreno, volumes produzidos e volumes previstos para o seu primeiro produto.</li><li>Quando você chegar ao final da página, você tem a opção de adicionar produtos adicionais, selecionando o botão 'Adicionar produto'. Você pode adicionar tantos produtos Fairtrade quantos forem necessários.</li><li>Continue a inserir as informações para o resto de seus produtos Fairtrade.</li><li>Volte para o produto anterior ou próximo usando os botões de navegação no final da página.</li><li>Para remover todas as informações sobre um produto, selecione 'Remover este produto' no final da página.</li></ul></i>"
          }
         }
        ]
       },
       {
        type: "panel",
        name: "volume_units_panel",
        elements: [
         {
          type: "boolean",
          name: "hide_unit_info_box",
          title: {
           default: "Toggle between \"Show\" and \"Hide\" to display",
           es: "Alterne entre \"Mostrar\" y \"Ocultar\" para mostrar",
           fr: "Basculer entre « Afficher » et « Masquer » pour afficher",
           pt: "Alternar entre \" Exibir\" e \" Ocultar\" para exibir"
          },
          hideNumber: true,
          defaultValue: "false",
          labelTrue: {
           default: "Hide",
           es: "Ocultar",
           fr: "Masquer",
           pt: "Ocultar"
          },
          labelFalse: {
           default: "Show",
           es: "Mostrar",
           fr: "Afficher",
           pt: "Exibir"
          }
         },
         {
          type: "panel",
          name: "unit_descriptions_panel",
          elements: [
           {
            type: "html",
            name: "kg_description",
            html: {
             default: "<hr><b>Kilograms (kg):</b> Use kg when you know the volume of your product in kilograms.",
             es: "<hr><b>Kilogramos (kg):</b> use kg cuando conozca el volumen de su producto en kilogramos.",
             fr: "<hr><b>Kilogrammes (kg):</b> Utilisez kg lorsque vous connaissez le volume de votre produit en kilogrammes.",
             pt: "<hr><b>Quilogramas (kg):</b> Utilize kg quando você souber o volume de seu produto em quilogramas."
            }
           },
           {
            type: "html",
            name: "mt_description",
            startWithNewLine: false,
            html: {
             default: "<hr><b>Metric tons (MT):</b> Use MT when you know the volume of your product in metric tons.",
             es: "<hr><b>Toneladas métricas (MT):</b> use MT cuando conoxca el volumen de su producto en toneladas métricas.",
             fr: "<hr><b>Tonnes  métriques (t):</b> Utilisez t lorsque vous connaissez le volume de votre produit en tonnes métriques.",
             pt: "<hr><b>Toneladas métricas (MT):</b> Utilize MT quando você souber o volume de seu produto em toneladas métricas."
            }
           },
           {
            type: "html",
            name: "boxes_large_description",
            html: {
             default: "<hr><b>18.14 kg Boxes:</b> For bananas only. use 18.14 kg Boxes when you know the number of boxes of bananas.",
             es: "<hr><b>Cajas de 18.14 kg:</b> Solo para plátanos. Use cajas de 18.14 kg cuando conozca el número de cajas de plátanos.",
             fr: "<hr><b>Boîtes de 8,14 kg :</b> Uniquement pour les bananes. Utilisez des boîtes de 18,14 kg lorsque vous connaissez le nombre de boîtes de bananes.",
             pt: "<hr><b>18,14 kg Caixas:</b> Apenas para bananas. Use caixas de 18,14 kg quando você souber o número de caixas de bananas."
            }
           },
           {
            type: "html",
            name: "boxes_small_description",
            startWithNewLine: false,
            html: {
             default: "<hr><b>13.5 kg Boxes:</b> For bananas only. use 13.5 kg Boxes when you know the number of boxes of bananas.",
             es: "<hr><b>Cajas de 13.5 kg:</b> Solo para plátanos. Use cajas de 13.5 kg cuando conozca el número de cajas de plátanos.",
             fr: "<hr><b>Boîtes de 13,5 kg :</b> Uniquement pour les bananes. Utilisez des boîtes de 13,5 kg lorsque vous connaissez le nombre de boîtes de bananes.",
             pt: "<hr><b>13,5 kg Caixas:</b> Apenas para bananas. Use caixas de 13,5 kg quando você souber o número de caixas de bananas."
            }
           },
           {
            type: "html",
            name: "pounds_description",
            hideNumber: true,
            html: {
             default: "<hr><b>Pound:</b> Use pound when you know the volume of your product in pounds.",
             es: "<hr><b>Libras:</b> use libras (lb) cuando conozca el volumen de su producto en libras.",
             fr: "<hr><b>Livres (Lb):</b> Utilisez lb lorsque vous connaissez le volume de votre produit en livres.",
             pt: "<hr><b>Libra:</b> Utilize libra quando você souber o volume do seu produto em libras."
            }
           },
           {
            type: "html",
            name: "quintales_description",
            startWithNewLine: false,
            html: {
             default: "<hr><b>Quintales (46 kg):</b> Use quintales when you know the volume of your product in quintales (1 quintal = 100 lbs = 46 kg).",
             es: "<hr><b>Quintales (46 kg):</b> use quintales cuando conozca el volumen de su producto en quintales (1 quintal = 100 lb = 46 kg).",
             fr: "<hr><b>Quintaux (q):</b> Utilisez q lorsque vous connaissez le volume de votre produit en quintaux.",
             pt: "<hr><b>Quintales (46 kg):</b> Utilize quintales quando você souber o volume de seu produto em quintales (1 quintal = 100 lbs = 46 kg)."
            }
           },
           {
            type: "html",
            name: "flowers_description",
            html: {
             default: "<hr><b>Stems of flowers:</b> For flowers and plants only. use when you know the number of flowers or plants.",
             es: "<hr><b>Tallos de flores:</b> solo para flores y plantas. Use cuando conozca el número de flores o plantas.",
             fr: "<hr><b>Tiges de fleurs:</b> Pour les fleurs et les plantes seulement. Utilisez cela lorsque vous connaissez le nombre de fleurs ou de plantes.",
             pt: "<hr><b>Caules de flores:</b> Apenas para flores e plantas. Use quando você souber o número de flores ou plantas."
            }
           },
           {
            type: "html",
            name: "1000stems_description",
            startWithNewLine: false,
            html: {
             default: "<hr><b>1000 stems of flowers:</b> For flowers and plants only. use when you know the number of 1,000 flower or plant bunches.",
             es: "<Hr><b>1000 tallos de flores:</b> solo para flores y plantas. Use cuando conozca el número de millares (1,000) de flores o plantas.",
             fr: "<Hr><b>11 000 tiges de fleurs:</b> Pour les fleurs et les plantes seulement. Utilisez cela lorsque vous connaissez le nombre de 1 000 lots de fleurs ou de plantes.",
             pt: "<hr><b>1000 caules de flores:</b> Apenas para flores e plantas. use quando você souber o número de 1.000 cachos de flores ou plantas."
            }
           },
           {
            type: "html",
            name: "litres_description",
            html: {
             default: "<hr><b>Litres:</b> For argan oil and wine bottles only. use litres when you know the volume of your oil or wine in litres.",
             es: "<hr><b>Litros:</b> para aceite de argán y botellas de vino solamente. Use litros cuando conozca el volumen de su aceite o vino en litros.",
             fr: "<hr><b>Litres (l):</b> Pour l'huile d'argan et les bouteilles de vin uniquement. Utilisez les litres lorsque vous connaissez le volume de votre huile ou de votre vin en litres.",
             pt: "<hr><b>Litros:</b> Apenas para garrafas de óleo de argão e vinho. usar litros quando você souber o volume de seu óleo ou vinho em litros."
            }
           },
           {
            type: "html",
            name: "items_description",
            startWithNewLine: false,
            html: {
             default: "<hr><b>Items:</b> For coconuts and sportsballs only. use items when you know the number of coconuts or sportsballs produced.",
             es: "<hr><b>Productos:</b> solo para cocos y balones deportivos. Use cuando conozca el número de cocos o balones deportivos producidos.",
             fr: "<hr><b>Pièces:</b> Uniquement pour les noix de coco et les ballons sportifs. Utilisez les pièces lorsque vous connaissez le nombre de noix de coco ou de balles de sport produites.",
             pt: "<hr><b>Itens:</b> Somente para cocos e bolas esportivas. use itens quando você souber o número de cocos ou bolas esportivas produzidas."
            }
           }
          ],
          visibleIf: "{hide_unit_info_box} = false"
         }
        ],
        title: {
         default: "Information box: Units for reporting volumes produced",
         es: "Cuadro de información Unidades para reportar volúmenes producidos",
         fr: "Encadré informatif : Unités de déclaration des volumes produits",
         pt: "Caixa de informações: Unidades para relatar os volumes produzidos"
        }
       },
       {
        type: "paneldynamic",
        name: "products_panel",
        title: {
         default: "Fairtrade products",
         es: "Productos de Fairtrade",
         fr: "Produits Fairtrade",
         pt: "Produtos Fairtrade"
        },
        hideNumber: true,
        templateElements: [
         {
          type: "dropdown",
          name: "major_product_category",
          title: {
           default: "Please select the product category from the dropdown that corresponds to your Fairtrade product certification:",
           es: "Seleccione la categoría del producto de la lista desplegable que corresponda a su certificación de producto de Fairtrade:",
           fr: "Veuillez sélectionner la catégorie de produit dans la liste déroulante qui correspond à votre certification de produit Fairtrade :",
           pt: "Favor selecionar a categoria de produto no menu suspenso que corresponde à sua certificação de produto Fairtrade:"
          },
          hideNumber: true,
          isRequired: true,
          choices: [
           "item1",
           "item2"
          ]
         },
         {
          type: "dropdown",
          name: "minor_product_category",
          visibleIf: "{panel.major_product_category} notempty",
          title: {
           default: "Please select the type of {panel.major_product_category} from the dropdown that your organization produced under Fairtrade certification",
           es: "Seleccione el tipo de {panel.major_product_category} de la lista desplegable que produjo su organización bajo la certificación Fairtrade",
           fr: "Veuillez sélectionner le type de {panel.major_product_category} à partir du menu déroulant que votre organisation a produit sous la certification Fairtrade",
           pt: "Favor selecionar o tipo de {panel.major_product_category} a partir do menu suspenso que sua organização produziu sob certificação Fairtrade"
          },
          hideNumber: true,
          isRequired: true,
          choices: [
           "item1",
           "item2"
          ]
         },
         {
          type: "text",
          name: "minor_category_other",
          visibleIf: "{panel.minor_product_category} contains 'Other' OR {panel.minor_product_category} contains 'other'",
          title: {
           default: "If your product was not listed and you selected 'other' please specify here the product for which your organization produced under Fairtrade certification:",
           es: "Si su producto no se listó y usted seleccionó “otro”, especifique aquí el producto para el cual su organización produjo bajo la certificación de Fairtrade:",
           fr: "Si votre produit n'a pas été listé et que vous avez sélectionné « Autre », veuillez préciser ici le produit pour lequel votre organisation a produit sous la certification Fairtrade :",
           pt: "Se seu produto não foi listado e você selecionou 'outro', favor especificar aqui o produto para o qual sua organização produziu sob a certificação Fairtrade:"
          },
          hideNumber: true
         },
         {
          type: "panel",
          name: "land_area_panel",
          elements: [
           {
            type: "html",
            name: "honey_land_area_html",
            visibleIf: "{panel.major_product_category} = 'Honey'",
            html: {
             default: "<br><i>For honey, please enter the <b>number of beehives</b> instead of {land_area_unit} of land</i>",
             es: "<br><i>Para miel, ingrese el <b>número de panales</b> en vez de {land_area_unit} de la tierra</i>",
             fr: "<br><i>Pour le miel, veuillez entrer le <b>nombre de ruches</b> au lieu des {land_area_unit} de terres</i>",
             pt: "<br><i>Para o mel, insira o <b>número de colméias</b> em vez de {land_area_unit} de terra</i>"
            }
           },
           {
            type: "text",
            name: "land_total_production",
            visibleIf: "{panel.land_area_known} empty",
            title: {
             default: "How many total {land_area_unit} of land was cultivated with {panel.minor_product_category}?",
             es: "¿Cuántos/as {land_area_unit} de tierra se cultivaron con {panel.minor_product_category}?",
             fr: "Combien de {land_area_unit} de terres on été cultivés/ées avec {panel.minor_product_category} ?",
             pt: "Qual o total de {land_area_unit} de terra foi cultivada com {panel.minor_product_category}?"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             },
             {
              type: "expression",
              text: {
               default: "A comma (,) is not allowed. Please use a dot (.) as a decimal separator.",
               es: "No se permiten comas (,). Utilice el punto (.) como separador decimal.",
               fr: "Veuillez ne pas mettre de virgule (,). Utilisez un point (.) comme séparateur décimal.",
               pt: "Uma vírgula (,) não é permitida. Favor usar um ponto (.) como separador decimal."
              },
              expression: "{panel.land_total_production} notcontains ','"
             },
             {
              type: "expression",
              text: {
               default: "The sum of organic and conventional land is greater than the total. Please correct the error.",
               es: "La suma de la tierra orgánica y convencional es mayor que el total. Corrija este error.",
               fr: "La somme des terres biologiques et conventionnelles est supérieure au total. Veuillez corriger l'erreur.",
               pt: "A soma de terras de fazendeiros orgânicos e convencionais é maior do que o total. Por favor, corrija o erro."
              },
              expression: "({panel.land_total_production} empty OR {panel.land_total_production} >= ({panel.land_conventional_production}+{panel.land_organic_production})) OR {organic_logic} <> 'mixed'"
             }
            ]
           },
           {
            type: "checkbox",
            name: "land_area_known",
            titleLocation: "hidden",
            hideNumber: true,
            choices: [
             {
              value: "not_known",
              text: {
               default: "Please check here if you do not know the total land area for this product",
               es: "Ponga una marca aquí si no conoce el área de tierra total para este producto",
               fr: "Veuillez vérifier ici si vous ne connaissez pas la superficie totale nombre de terres pour ce produit",
               pt: "Favor verificar aqui se você não sabe a área total de terra para este produto"
              }
             }
            ]
           },
           {
            type: "text",
            name: "land_conventional_production",
            visibleIf: "{organic_logic} anyof ['mixed', 'conventional_only'] AND {panel.conventional_organic_area_known} empty",
            title: {
             default: "How many {land_area_unit}Â of land was under conventional cultivation or in transition to organic?",
             es: "¿Cuántos/as {land_area_unit} de tierra estuvieron bajo cultivo convencional o en transición a orgánico?",
             fr: "Combien de {land_area_unit} de terres étaient dédiés/ées à la culture conventionnelle ou étaient en transition vers la culture biologique ?",
             pt: "Quantas {land_area_unit} de terra estavam sob cultivo convencional ou em transição para orgânico?"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             },
             {
              type: "expression",
              text: {
               default: "A comma (,) is not allowed. Please use a dot (.) as a decimal separator.",
               es: "No se permiten comas (,). Utilice el punto (.) como separador decimal.",
               fr: "Veuillez ne pas mettre de virgule (,). Utilisez un point (.) comme séparateur décimal.",
               pt: "Uma vírgula (,) não é permitida. Favor usar um ponto (.) como separador decimal."
              },
              expression: "{panel.land_conventional_production} notcontains ','"
             },
             {
              type: "expression",
              text: {
               default: "Conventional land area is greater than total land area. Please correct the error.",
               es: "El área de tierra convencional es mayor que el área de tierra total. Corrija este error.",
               fr: "La superficie des terres conventionnelles est supérieure à la superficie totale des terres. Veuillez corriger l'erreur.",
               pt: "A área de terra convencional é maior do que a área total da terra. Por favor, corrija o erro."
              },
              expression: "{panel.land_total_production} empty OR {panel.land_conventional_production} empty OR {panel.land_total_production} >= {panel.land_conventional_production}"
             }
            ]
           },
           {
            type: "text",
            name: "land_organic_production",
            visibleIf: "{organic_logic} anyof ['mixed', 'organic_only'] AND {panel.conventional_organic_area_known} empty",
            startWithNewLine: false,
            title: {
             default: "How many {land_area_unit}Â of land was under cultivation of organic certification?",
             es: "¿Cuántos/as {land_area_unit} de tierra estuvieron bajo cultivo de certificación orgánica?",
             fr: "Combien de {land_area_unit} de terres étaient dédiés/ées à la culture sous certification biologique ?",
             pt: "Quantas {land_area_unit} de terra estavam sob cultivo de certificação orgânica?"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             },
             {
              type: "expression",
              text: {
               default: "A comma (,) is not allowed. Please use a dot (.) as a decimal separator.",
               es: "No se permiten comas (,). Utilice el punto (.) como separador decimal.",
               fr: "Veuillez ne pas mettre de virgule (,). Utilisez un point (.) comme séparateur décimal.",
               pt: "Uma vírgula (,) não é permitida. Favor usar um ponto (.) como separador decimal."
              },
              expression: "{panel.land_organic_production} notcontains ','"
             },
             {
              type: "expression",
              text: {
               default: "Organic land area is greater than total land area. Please correct the error.",
               es: "El área de tierra orgánica es mayor que el área de tierra total. Corrija este error.",
               fr: "La superficie des terres biologiques est supérieure à la superficie totale des terres. Veuillez corriger l'erreur.",
               pt: "A área de terra orgânica é maior do que a área total da terra. Por favor, corrija o erro."
              },
              expression: "{panel.land_total_production} empty OR {panel.land_organic_production} empty OR {panel.land_total_production} >= {panel.land_organic_production}"
             }
            ]
           },
           {
            type: "html",
            name: "warning_land_area_sum",
            visibleIf: "{panel.land_total_production} > {panel.land_conventional_production}+{panel.land_organic_production} AND {panel.land_conventional_production} notempty AND {panel.land_organic_production} notempty AND {organic_logic} = 'mixed'",
            html: {
             default: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Warning!</h3>\n<span style=\"font-size: medium;\">The sum of conventional and organic land area is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>",
             es: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">¡Advertencia!</h3>\n<span style=\"font-size: medium;\">La suma de tierra convencional y orgánica es menor que el total. Revise nuevamente que los números reportados sean correctos antes de continuar.</span>\n</div>",
             fr: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Avertissement !</h3>\n<span style=\"font-size: medium;\">La somme des superficies des terres conventionnelles et biologiques est inférieure au total. Veuillez vérifier que les chiffres rapportés sont corrects avant de continuer.</span>\n</div>",
             pt: "<br><div style=\"background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px\"><h3 style=\"margin: auto; color: red; font-weight: bold\">Advertência!</h3> <span style=\"font-size: medium;\">A soma da área de terra convencional e orgânica é menor do que o total. Favor verificar duas vezes se os números informados estão corretos antes de seguir em frente.</span> </div>"
            }
           },
           {
            type: "checkbox",
            name: "conventional_organic_area_known",
            visibleIf: "{organic_logic} = 'mixed'",
            titleLocation: "hidden",
            hideNumber: true,
            choices: [
             {
              value: "not_known",
              text: {
               default: "Please check here if you do not know the {land_area_unit} of organic and conventional land area for this product",
               es: "Ponga una marca aquí si no conoce la extensión de {land_area_unit} del área de tierra orgánica y convencional para este producto",
               fr: "Veuillez vérifier ici si vous ne connaissez pas la superficie des terres en {land_area_unit} biologiques et conventionnelles pour ce produit",
               pt: "Favor, verifique aqui se você não conhece a {land_area_unit} orgânica e convencional para este produto"
              }
             }
            ]
           }
          ],
          visibleIf: "{panel.minor_product_category} notempty",
          title: {
           default: "Land area under Fairtrade cultivation: {panel.major_product_category} ({panel.minor_product_category})",
           es: "Área de tierra bajo cultivo de Fairtrade: {panel.major_product_category} ({panel.minor_product_category})",
           fr: "Superficie des terres cultivées sous certification Fairtrade : {panel.major_product_category} ({panel.minor_product_category})",
           pt: "Área de terra sob cultivo Fairtrade: {panel.major_product_category} ({panel.minor_product_category})"
          }
         },
         {
          type: "panel",
          name: "panel_volumes_produced",
          elements: [
           {
            type: "dropdown",
            name: "product_form_name",
            title: {
             default: "In what product form would you like to report your organization's {panel.minor_product_category} production?",
             es: "En qué forma de producto le gustaría reportar la producción de {panel.minor_product_category} de su organización?",
             fr: "Dans quel type de produit souhaitez-vous rapporter la production  {panel.minor_product_category} de votre organisation",
             pt: "Em que forma de produto você gostaria de relatar a produção de sua organização {panel.minor_product_category}?"
            },
            hideNumber: true,
            isRequired: true
           },
           {
            type: "dropdown",
            name: "volume_produced_unit",
            startWithNewLine: false,
            title: {
             default: "In what unit would you like to report your organization's {panel.minor_product_category} production?",
             es: "¿En qué unidad le gustaría reportar la producción de {panel.minor_product_category} de su organización?",
             fr: "Dans quelle unité souhaitez-vous rapporter la production  {panel.minor_product_category} de votre organisation",
             pt: "Em que unidade você gostaria de relatar a produção de sua organização {panel.minor_product_category}?"
            },
            hideNumber: true,
            isRequired: true,
            choices: [
             "kg",
             {
              value: "mt",
              text: {
               default: "MT",
               fr: "t"
              }
             },
             {
              value: "boxes_large",
              text: {
               default: "18.14 kg Boxes",
               es: "Cajas de 18.14 kg",
               fr: "Boîtes de 18,14 kg",
               pt: "18.14 kg Caixas"
              }
             },
             {
              value: "boxes_small",
              text: {
               default: "13.5 kg Boxes",
               es: "Cajas de 13.5 kg",
               fr: "Boîtes de 13,5 kg",
               pt: "13.5 kg Caixas"
              }
             },
             {
              value: "pound",
              text: {
               default: "Pound",
               es: "Libra",
               fr: "lb",
               pt: "Libras"
              }
             },
             {
              value: "quintales",
              text: {
               default: "Quintales (46 kg)",
               fr: "q (46 kg)"
              }
             },
             {
              value: "stems",
              text: {
               default: "Stems of flowers",
               es: "Tallos de flores",
               fr: "Tiges de fleurs",
               pt: "Caules de flores"
              }
             },
             {
              value: "1000stems",
              text: {
               default: "1000 stems of flowers",
               es: "1000 tallos de flores",
               fr: "1 000 tiges de fleurs",
               pt: "1000 Caules de flores"
              }
             },
             {
              value: "litres",
              text: {
               default: "Litres",
               es: "Litros",
               fr: "l",
               pt: "Litros"
              }
             },
             {
              value: "items",
              text: {
               default: "Items",
               es: "Productos",
               fr: "Pièces",
               pt: "Itens"
              }
             }
            ]
           },
           {
            type: "text",
            name: "product_form_other",
            visibleIf: "screenValue('product_form_name') contains 'Other' OR screenValue('product_form_name') contains 'other'",
            title: {
             default: "If your product was not listed and you selected 'Other' please specify here the product form for which you are reporting production:",
             es: "Si su producto no se listó y usted seleccionó “otro”, especifique aquí la forma del producto para el cual reporta la producción:",
             fr: "Si votre produit n'a pas été listé et que vous avez sélectionné « Autre », veuillez préciser ici le type de produit pour lequel vous rapporter la production :",
             pt: "Se seu produto não foi listado e você selecionou 'outro', favor especificar aqui a forma do produto para o qual você está relatando a produção:"
            },
            hideNumber: true
           },
           {
            type: "text",
            name: "volume_conventional_produced",
            visibleIf: "{organic_logic} anyof ['mixed', 'conventional_only']",
            title: {
             default: "How many {panel.volume_produced_unit} of {panel.product_form_name} did your organization produce under conventional cultivation or under transition to organic?",
             es: "¿Cuántos/as {panel.volume_produced_unit} de {panel.product_form_name} produjo su organización bajo cultivo convencional o bajo transición a orgánico?",
             fr: "Combien de {panel.volume_produced_unit} de {panel.product_form_name} votre organisation a-t-elle produit dans le cadre de la culture conventionnelle ou en transition vers l'agriculture biologique ?",
             pt: "Quantos {panel.volume_produced_unit} de {panel.product_form_name} sua organização produziu sob cultivo convencional ou sob transição para orgânico?"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             },
             {
              type: "expression",
              text: {
               default: "A comma (,) is not allowed. Please use a dot (.) as a decimal separator.",
               es: "No se permiten comas (,). Utilice el punto (.) como separador decimal.",
               fr: "Veuillez ne pas mettre de virgule (,). Utilisez un point (.) comme séparateur décimal.",
               pt: "Uma vírgula (,) não é permitida. Favor usar um ponto (.) como separador decimal."
              },
              expression: "{panel.volume_conventional_produced} notcontains ','"
             }
            ]
           },
           {
            type: "text",
            name: "volume_organic_produced",
            visibleIf: "{organic_logic} anyof ['mixed', 'organic_only']",
            startWithNewLine: false,
            title: {
             default: "How many {panel.volume_produced_unit} of {panel.product_form_name} did your organization produce under organic certification?",
             es: "¿Cuántos/as {panel.volume_produced_unit} de {panel.product_form_name} produjo su organización bajo certificación orgánica?",
             fr: "Combien de {panel.volume_produced_unit} de {panel.product_form_name} votre organisation a-t-elle produit sous certification biologique ?",
             pt: "Quantos {panel.volume_produced_unit} de {panel.product_form_name} sua organização produziu sob certificação orgânica?"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             },
             {
              type: "expression",
              text: {
               default: "A comma (,) is not allowed. Please use a dot (.) as a decimal separator.",
               es: "No se permiten comas (,). Utilice el punto (.) como separador decimal.",
               fr: "Veuillez ne pas mettre de virgule (,). Utilisez un point (.) comme séparateur décimal.",
               pt: "Uma vírgula (,) não é permitida. Favor usar um ponto (.) como separador decimal."
              },
              expression: "{panel.volume_organic_produced} notcontains ','"
             }
            ]
           },
           {
            type: "boolean",
            name: "volume_produced_estimated_or_measured",
            title: {
             default: "Is the reported volume produced the actual amount or estimated?",
             es: "¿El volumen reportado produjo la cantidad real o un aproximado?",
             fr: "Le volume déclaré est-il le volume réel ou estimé ?",
             pt: "O volume reportado é a quantidade real ou estimada?"
            },
            hideNumber: true,
            defaultValue: "true",
            labelTrue: {
             default: "Estimates",
             es: "Cálculos",
             fr: "Estimé",
             pt: "Estimativas"
            },
            labelFalse: {
             default: "Actual",
             es: "Real",
             fr: "Réel",
             pt: "Real"
            }
           },
           {
            type: "dropdown",
            name: "volume_produced_estimated_how",
            visibleIf: "{panel.volume_produced_estimated_or_measured} = true",
            startWithNewLine: false,
            title: {
             default: "What measure did you use to estimate the volume produced?",
             es: "¿Qué medida usó para calcular el volumen producido?",
             fr: "Quelle mesure avez-vous utilisée pour estimer le volume du produit ?",
             pt: "Que medida você utilizou para estimar o volume produzido?"
            },
            hideNumber: true,
            choices: [
             {
              value: "yields",
              text: {
               default: "Yields",
               es: "Rendimientos",
               fr: "Rendements",
               pt: "Rendimentos"
              }
             },
             {
              value: "FT_sales",
              text: {
               default: "Fairtrade Sales",
               es: "Ventas de Fairtrade",
               fr: "Ventes Fairtrade",
               pt: "Vendas Fairtrade"
              }
             },
             {
              value: "total_sales",
              text: {
               default: "Total sales",
               es: "Ventas totales",
               fr: "Total des ventes",
               pt: "Total de vendas"
              }
             },
             {
              value: "other",
              text: {
               default: "Other (specify in comments)",
               es: "Otro (especifique en los comentarios)",
               fr: "Autre (veuillez préciser dans les commentaires)",
               pt: "Outros (especifique nos comentários)"
              }
             }
            ]
           }
          ],
          visibleIf: "{panel.minor_product_category} notempty",
          title: {
           default: "Volumes Produced on Fairtrade terms in the 2021-2022 production cycle: {panel.major_product_category} ({panel.minor_product_category})",
           es: "Volúmenes producidos en términos de Fairtrade en el ciclo de producción 2021-2022: {panel.major_product_category} ({panel.minor_product_category})",
           fr: "Volumes produits conformément aux conditions Fairtrade dans le cycle de production 2021-2022 :  {panel.major_product_category} ({panel.minor_product_category})",
           pt: "Volumes produzidos em termos Fairtrade no ciclo de produção de 2021-2022: {panel.major_product_category} ({panel.minor_product_category})"
          }
         },
         {
          type: "panel",
          name: "summary_production_yields",
          elements: [
           {
            type: "expression",
            name: "volume_produced_total_calc",
            title: {
             default: "Total volume produced:",
             es: "Volumen total producido:",
             fr: "Volume total produit :",
             pt: "Volume total produzido:"
            },
            hideNumber: true,
            expression: "{panel.volume_organic_produced}+{panel.volume_conventional_produced}",
            displayStyle: "decimal"
           },
           {
            type: "expression",
            name: "total_yields_calc",
            visibleIf: "{panel.land_total_production} notempty",
            startWithNewLine: false,
            title: {
             default: "Estimated total yields of {panel.product_form_name} in {panel.volume_produced_unit}/{land_area_unit}",
             es: "Rendimientos totales calculados de {panel.product_form_name} en {panel.volume_produced_unit}/{land_area_unit}",
             fr: "Estimation des rendements totaux de {panel.product_form_name} en {panel.volume_produced_unit}/{land_area_unit}",
             pt: "Rendimento total estimado de {panel.product_form_name} em {panel.volume_produced_unit}/{land_area_unit}"
            },
            hideNumber: true,
            expression: "({panel.volume_organic_produced}+{panel.volume_conventional_produced})/{panel.land_total_production}",
            displayStyle: "decimal"
           },
           {
            type: "expression",
            name: "conventional_yields_calc",
            visibleIf: "{panel.land_conventional_production} notempty AND {organic_logic} anyof ['mixed', 'conventional_only']",
            title: {
             default: "Estimated conventional yields of {panel.product_form_name} in {panel.volume_produced_unit}/{land_area_unit}",
             es: "Rendimientos convencionales calculados de {panel.product_form_name} en {panel.volume_produced_unit}/{land_area_unit}",
             fr: "Estimation des rendements conventionnels de {panel.product_form_name} en {panel.volume_produced_unit}/{land_area_unit}",
             pt: "Rendimentos convencionais estimados de {panel.product_form_name} em {panel.volume_produced_unit}/{land_area_unit}"
            },
            hideNumber: true,
            expression: "{panel.volume_conventional_produced}/{panel.land_conventional_production}",
            displayStyle: "decimal"
           },
           {
            type: "expression",
            name: "organic_yields_calc",
            visibleIf: "{panel.land_organic_production} notempty AND {organic_logic} anyof ['mixed', 'organic_only']",
            startWithNewLine: false,
            title: {
             default: "Estimated organic yields of {panel.product_form_name} in {panel.volume_produced_unit}/{land_area_unit}",
             es: "Rendimientos orgánicos calculados de {panel.product_form_name} en {panel.volume_produced_unit}/{land_area_unit}",
             fr: "Estimation des rendements biologiques de {panel.product_form_name} en {panel.volume_produced_unit}/{land_area_unit}",
             pt: "Rendimentos orgânicos estimados de {panel.product_form_name} em {panel.volume_produced_unit}/{land_area_unit}"
            },
            hideNumber: true,
            expression: "{panel.volume_organic_produced}/{panel.land_organic_production}",
            displayStyle: "decimal"
           }
          ],
          visibleIf: "{panel.minor_product_category} notempty",
          title: {
           default: "Summary of production and yields for the 2021-2022 production cycle: {panel.major_product_category} ({panel.minor_product_category})",
           es: "Resumen de producción y rendimientos para el ciclo de producción 2021-2022: {panel.major_product_category} ({panel.minor_product_category})",
           fr: "Résumé de la production et des rendements pour le cycle de production 2021-2022 : {panel.major_product_category} ({panel.minor_product_category})",
           pt: "Resumo da produção e rendimentos para o ciclo de produção 2021-2022: {panel.major_product_category} ({panel.minor_product_category})"
          }
         },
         {
          type: "panel",
          name: "panel_volumes_forecast",
          elements: [
           {
            type: "dropdown",
            name: "volume_forecast_unit",
            visibleIf: "{panel.volume_forecast_known} empty",
            startWithNewLine: false,
            title: {
             default: "In what unit would you like to report your organization's {panel.minor_product_category} forecasted volume?",
             es: "¿En qué unidad le gustaría reportar el pronóstico de volumen de {panel.minor_product_category} de su organización?",
             fr: "Dans quelle unité souhaitez-vous rapporter le volume estimé  {panel.minor_product_category} de votre organisation ?",
             pt: "Em que unidade você gostaria de relatar o volume previsto de sua organização {panel.minor_product_category}?"
            },
            hideNumber: true,
            isRequired: true,
            choices: [
             "kg",
             {
              value: "mt",
              text: {
               default: "MT",
               fr: "t"
              }
             },
             {
              value: "boxes_large",
              text: {
               default: "18.14 kg Boxes",
               es: "Cajas de 18.14 kg",
               fr: "Boîtes de 18,14 kg",
               pt: "18.14 kg Caixas"
              }
             },
             {
              value: "boxes_small",
              text: {
               default: "13.5 kg Boxes",
               es: "Cajas de 13.5 kg",
               fr: "Boîtes de 13,5 kg",
               pt: "13.5 kg Caixas"
              }
             },
             {
              value: "pound",
              text: {
               default: "Pound",
               es: "Libra",
               fr: "lb",
               pt: "Libras"
              }
             },
             {
              value: "quintales",
              text: {
               default: "Quintales (46 kg)",
               fr: "q (46 kg)"
              }
             },
             {
              value: "stems",
              text: {
               default: "Stems of flowers",
               es: "Tallos de flores",
               fr: "Tiges de fleurs",
               pt: "Caules de flores"
              }
             },
             {
              value: "1000stems",
              text: {
               default: "1000 stems of flowers",
               es: "1000 tallos de flores",
               fr: "1 000 tiges de fleurs",
               pt: "1000 Caules de flores"
              }
             },
             {
              value: "litres",
              text: {
               default: "Litres",
               es: "Litros",
               fr: "l",
               pt: "Litros"
              }
             },
             {
              value: "items",
              text: {
               default: "Items",
               es: "Productos",
               fr: "Pièces",
               pt: "Itens"
              }
             }
            ]
           },
           {
            type: "text",
            name: "volume_conventional_forecast",
            visibleIf: "{panel.volume_forecast_known} empty",
            title: {
             default: "How many {panel.volume_forecast_unit} of {panel.product_form_name} produced under conventional cultivation or under transition to organic does your organization forecast will be of export quality?",
             es: "¿Cuántos/as {panel.volume_forecast_unit} de {panel.product_form_name} producidos bajo cultivo convencional o bajo la transición a orgánico pronostica su organización que tendrán calidad de exportación?",
             fr: "Combien de {panel.volume_forecast_unit} de {panel.product_form_name} produits/es sous culture conventionnelle ou en transition vers la culture biologique de qualité exportable votre organisation prévoit-elle d’avoir ?",
             pt: "Quantos {panel.volume_forecast_unit} de {panel.product_form_name} produzidos sob cultivo convencional ou em transição para orgânico sua organização prevê que serão de qualidade de exportação?"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             },
             {
              type: "expression",
              text: {
               default: "A comma (,) is not allowed. Please use a dot (.) as a decimal separator.",
               es: "No se permiten comas (,). Utilice el punto (.) como separador decimal.",
               fr: "Veuillez ne pas mettre de virgule (,). Utilisez un point (.) comme séparateur décimal.",
               pt: "Uma vírgula (,) não é permitida. Favor usar um ponto (.) como separador decimal."
              },
              expression: "{panel.volume_conventional_forecast} notcontains ','"
             }
            ]
           },
           {
            type: "text",
            name: "volume_organic_forecast",
            visibleIf: "{panel.volume_forecast_known} empty",
            startWithNewLine: false,
            title: {
             default: "How many {panel.volume_forecast_unit} of {panel.product_form_name} produced under organic certification does your organization forecast will be of export quality?",
             es: "¿Cuántos/as {panel.volume_forecast_unit} de {panel.product_form_name} producidos bajo certificación orgánica pronostica su organización que tendrán calidad de exportación?",
             fr: "Combien de {panel.volume_forecast_unit} de {panel.product_form_name} produits/es sous certification biologique de qualité exportable votre organisation prévoit-elle d’avoir ?",
             pt: "Quantos {panel.volume_forecast_unit} de {panel.product_form_name} produzidos sob certificação orgânica sua organização prevê que serão de qualidade para exportação?"
            },
            hideNumber: true,
            validators: [
             {
              type: "numeric",
              text: {
               default: "Please enter a valid number.",
               es: "Ingrese un número válido.",
               fr: "Veuillez entrer un nombre valide.",
               pt: "Por favor, digite um número válido."
              }
             },
             {
              type: "expression",
              text: {
               default: "A comma (,) is not allowed. Please use a dot (.) as a decimal separator.",
               es: "No se permiten comas (,). Utilice el punto (.) como separador decimal.",
               fr: "Veuillez ne pas mettre de virgule (,). Utilisez un point (.) comme séparateur décimal.",
               pt: "Uma vírgula (,) não é permitida. Favor usar um ponto (.) como separador decimal."
              },
              expression: "{panel.volume_organic_forecast} notcontains ','"
             }
            ]
           },
           {
            type: "checkbox",
            name: "volume_forecast_known",
            titleLocation: "hidden",
            hideNumber: true,
            choices: [
             {
              value: "not_known",
              text: {
               default: "Please check here if you do not know the forecast volume for this product or this question is not applicable",
               es: "Ponga una marca aquí si no conoce el volumen pronosticado para este producto o si esta pregunta no aplica",
               fr: "Veuillez vérifier ici si vous ne connaissez pas le volume estimé pour ce produit ou si cette question n'est pas applicable",
               pt: "Favor verificar aqui se você não sabe o volume previsto para este produto ou se esta pergunta não é aplicável"
              }
             }
            ]
           }
          ],
          visibleIf: "{panel.minor_product_category} notempty",
          title: {
           default: "Forecast of volumes of export quality for the 2022-2023 production cycle: {panel.major_product_category} ({panel.minor_product_category})",
           es: "Pronóstico de producción y rendimientos para el ciclo de producción 2022-2023: {panel.major_product_category} ({panel.minor_product_category})",
           fr: "Résumé des volumes et des rendements de qualité exportable pour le cycle de production 2022-2023 : {panel.major_product_category ({panel.minor_product_category})",
           pt: "Previsão de volumes de qualidade de exportação para o ciclo de produção de 2022-2023: {panel.major_product_category} ({panel.minor_product_category})"
          }
         },
         {
          type: "text",
          name: "product_page_comments_byproduct",
          visibleIf: "{panel.minor_product_category} notempty",
          title: {
           default: "Optional space for comments:",
           es: "Espacio opcional para comentarios:",
           fr: "Espace facultatif pour les commentaires :",
           pt: "Espaço opcional para comentários:"
          },
          hideNumber: true
         }
        ],
        noEntriesText: {
         default: "You have not entered any products yet.\nClick the button below to start.",
         es: "No ha ingresado ningún producto aún.\nHaga clic en el botón siguiente para comenzar.",
         fr: "Vous n'avez pas encore entré de produits.\nCliquez sur le bouton ci-dessous pour commencer.",
         pt: "Você ainda não entrou em nenhum produto. Clique no botão abaixo para começar."
        },
        confirmDelete: true,
        confirmDeleteText: {
         default: "Are you sure you want to delete this product?",
         es: "¿Está seguro de que desea borrar este producto?",
         fr: "Voulez-vous vraiment supprimer ce produit ?",
         pt: "Você tem certeza de que deseja excluir este produto?"
        },
        panelAddText: {
         default: "Add Product",
         es: "Agregar producto",
         fr: "Ajouter un produit",
         pt: "Adicionar produto"
        },
        panelRemoveText: {
         default: "Remove this product",
         es: "Remover este producto",
         fr: "Supprimer ce produit",
         pt: "Remover este produto"
        },
        panelPrevText: {
         default: "Previous product",
         es: "Producto previo",
         fr: "Produit précédent",
         pt: "Produto anterior"
        },
        panelNextText: {
         default: "Next product",
         es: "Siguiente producto",
         fr: "Produit suivant",
         pt: "Próximo produto"
        },
        showQuestionNumbers: "onPanel",
        renderMode: "progressTopBottom"
       }
      ],
      visibleIf: "{consent_to_participate} = 'consent'",
      title: {
       default: "Products produced by your organization on Fairtrade terms",
       es: "Productos producidos por su organización en términos de Fairtrade",
       fr: "Produits fabriqués par votre organisation conformément aux conditions de Fairtrade",
       pt: "Produtos produzidos por sua organização em termos de Fairtrade"
      },
      navigationTitle: {
       default: "Products",
       es: "Productos",
       fr: "Produits",
       pt: "Produtos"
      }
     },
     {
      name: "feedback_fairinsight",
      elements: [
       {
        type: "panel",
        name: "feedback_instructions_panel",
        elements: [
         {
          type: "html",
          name: "feedback_instructions",
          html: {
           default: "<br><b>Thank you for filling out our survey</b>, it covered a set of questions related to some of Fairtrade's most frequently used data. Your contributions will help us better understand challenges in reporting and the quality of the data being reported.<br><br>In this section, we would appreciate to hear from you on the challenges, suggestions and feedback that you and your organization have relating to managing and sharing information to Fairtrade through FairInsight. We would appreciate any feedback you may be willing to share. We will only use your feedback on this page to identify common challenges faced by producer organizations and assess solutions for improvements.",
           es: "<br><b>Gracias por participar en nuestra encuesta</b>. Esta cubrió un conjunto de preguntas relacionadas con algunos de los datos utilizados con más frecuencia de Fairtrade. Sus contribuciones nos ayudarán a comprender mejor los retos al hacer reportes y la calidad de los datos que se reportan.<br><br>En esta sección agradeceremos saber sobre sus comentarios acerca de los retos, sugerencias y retroalimentación que usted y su organización tengan en relación con gestionar y compartir información a Fairtrade mediante FairInsight. Apreciaremos cualquier retroalimetnación que desee compartir. Solo usaremos sus comentarios en esta página para identificar retos comunes que enfrenten las organizaciones productoras y evaluar soluciones para mejoría.",
           fr: "<br><b>Nous vous remercions d’avoir compléter notre enquête</b>, cette dernière couvrait un ensemble de questions liées à certaines des données les plus fréquemment utilisées par Fairtrade. Vos contributions nous aideront à mieux comprendre les défis liés à la déclaration des informations et à la qualité des données rapportées.<br><br>Dans cette section, nous aimerions connaître vos défis, suggestions et commentaires concernant la gestion et le partage des informations avec Fairtrade par le biais de FairInsight. Nous vous serions reconnaissants de nous faire part de vos commentaires. Nous n'utiliserons vos commentaires sur cette page que pour identifier les défis communs auxquels sont confrontées les organisations de producteurs et pour évaluer des solutions en vue de les améliorer.",
           pt: "<br><b>Obrigado por preencher nossa pesquisa</b>, ela cobriu um conjunto de perguntas relacionadas a alguns dos dados mais freqüentemente utilizados do Fairtrade. Suas contribuições nos ajudarão a compreender melhor os desafios na elaboração de relatórios e a qualidade dos dados que estão sendo relatados.<br><br>Nesta seção, gostaríamos de ouvir de você sobre os desafios, sugestões e feedback que você e sua organização têm em relação ao gerenciamento e compartilhamento de informações para o Fairtrade através da FairInsight. Agradecemos qualquer feedback que você possa estar disposto a compartilhar. Utilizaremos seu feedback nesta página apenas para identificar os desafios comuns enfrentados pelas organizações de produtores e avaliar soluções para melhorias."
          }
         }
        ]
       },
       {
        type: "panel",
        name: "survey_feedback",
        elements: [
         {
          type: "rating",
          name: "rating_survey_overall",
          title: {
           default: "On a scale of 1 to 5, how easy overall was it to fill out the information in this survey?",
           es: "En una escala del 1 al 5, ¿qué tan fácil fue en general llenar la información en esta encuesta?",
           fr: "Sur une échelle de 1 à 5, dans l'ensemble, a-t-il été facile de remplir les informations de cette enquête ?",
           pt: "Em uma escala de 1 a 5, quão fácil foi, em geral, preencher as informações desta pesquisa?"
          },
          hideNumber: true,
          minRateDescription: {
           default: "(Very Difficult)",
           es: "(Muy difícil)",
           fr: "(Très difficile)",
           pt: "(Muito Difícil)"
          },
          maxRateDescription: {
           default: "(Very Easy)",
           es: "(Muy fácil)",
           fr: "(Très facile)",
           pt: "(Muito fácil)"
          }
         },
         {
          type: "rating",
          name: "rating_survey_questions",
          title: {
           default: "On a scale of 1 to 5, how easy was it to understand the questions and what was being asked?",
           es: "En una escala del 1 al 5, ¿qué tan fácil es comprender las preguntas y qué se estaba preguntando?",
           fr: "Sur une échelle de 1 à 5, dans quelle mesure était-il facile de comprendre les questions et ce qui était demandé ?",
           pt: "Em uma escala de 1 a 5, quão fácil foi entender as perguntas e o que estava sendo feito?"
          },
          hideNumber: true,
          minRateDescription: {
           default: "(Very Difficult)",
           es: "(Muy difícil)",
           fr: "(Très difficile)",
           pt: "(Muito Difícil)"
          },
          maxRateDescription: {
           default: "(Very Easy)",
           es: "(Muy fácil)",
           fr: "(Très facile)",
           pt: "(Muito fácil)"
          }
         },
         {
          type: "rating",
          name: "rating_survey_content",
          title: {
           default: "On a scale of 1 to 5, how relevant were the questions to your organization?",
           es: "En una escala de 1 a 5, ¿qué tan relevante fueron las preguntas para su organización?",
           fr: "Sur une échelle de 1 à 5, dans quelle mesure les questions étaient-elles pertinentes pour votre organisation ?",
           pt: "Em uma escala de 1 a 5, quão relevantes foram as perguntas para sua organização?"
          },
          hideNumber: true,
          minRateDescription: {
           default: "(Not at all Relevant)",
           es: "(Nada relevantes)",
           fr: "(Pas du tout pertinentes)",
           pt: "(Nada Relevante)"
          },
          maxRateDescription: {
           default: "(Very Relevant)",
           es: "(Muy relevantes)",
           fr: "(Très pertinentes)",
           pt: "(Muito Relevante)"
          }
         },
         {
          type: "comment",
          name: "textbox_issues_survey",
          title: {
           default: "When completing this survey, did you have any issues or trouble with any parts of the survey? If so, please explain here (max. 500 characters):",
           es: "Cuando completaba esta encuesta, ¿tuvo problemas con alguna parte de la misma? De ser así, explique aquí (máx. 500 caracteres):",
           fr: "Au moment de remplir cette enquête, avez-vous eu des difficultés ou rencontré des problèmes avec certaines parties de l’enquête ? Si oui, veuillez expliquer ici (max. 500 caractères) :",
           pt: "Ao concluir esta pesquisa, você teve algum problema ou dificuldade com alguma parte da pesquisa? Em caso positivo, explique aqui (máx. 500 caracteres):"
          },
          hideNumber: true,
          maxLength: 500
         },
         {
          type: "comment",
          name: "textbox_suggestions_survey",
          title: {
           default: "We want to improve how we ask this type of information from Fairtrade producer organizations. Do you have any suggestions for improving the survey in any way (on the questions, functionality, accessibility, etc.) that you would like to share? (max. 500 characters):",
           es: "Deseamos mejorar cómo pedimos este tipo de información a las organizaciones productoras de Fairtrade. ¿Tiene usted sugerencias para mejorar la encuesta en cualquier manera (sobre preguntas, funcionalidad, accesibilidad, etc.) que desee compartir? (máx. 500 caracteres)",
           fr: "Nous voulons améliorer la façon dont nous demandons ce type d'informations aux organisations de producteurs de Fairtrade. Avez-vous des suggestions pour améliorer l'enquête de quelque façon que ce soit (sur les questions, la fonctionnalité, l'accessibilité, etc.) que vous aimeriez partager ? (max. 500 caractères) :",
           pt: "Queremos melhorar como pedimos este tipo de informação às organizações de produtores Fairtrade. Você tem alguma sugestão para melhorar a pesquisa de alguma forma (sobre as perguntas, funcionalidade, acessibilidade, etc.) que gostaria de compartilhar? (máx. 500 caracteres):"
          },
          hideNumber: true,
          maxLength: 500
         }
        ],
        title: {
         default: "Your survey experience",
         es: "Su experiencia de la encuesta",
         fr: "Votre expérience relative à l’enquête",
         pt: "Sua experiência em pesquisa"
        }
       },
       {
        type: "panel",
        name: "sharing_to_ft_feedback",
        elements: [
         {
          type: "comment",
          name: "textbox_reporting",
          title: {
           default: "We want to better understand the challenges that producer organizations face when asked to share information with Fairtrade. Does your organization have any challenges that you would like to share with us? (max. 500 characters)",
           es: "Deseamos comprender mejor los retos que enfrentan las organizaciones productoras cuando se les pide compartir información con Fairtrade. ¿Su organización tiene retos que desearía compartir con nosotros? (máx. 500 caracteres)",
           fr: "Nous voulons mieux comprendre les défis auxquels sont confrontées les organisations de producteurs lorsque nous leur demandons de partager des informations avec Fairtrade. Votre organisation a-t-elle des défis à relever que vous aimeriez partager avec nous ? (max. 500 caractères)",
           pt: "Queremos entender melhor os desafios que as organizações de produtores enfrentam quando solicitadas a compartilhar informações com o Fairtrade. Sua organização tem algum desafio que você gostaria de compartilhar conosco? (máx. 500 caracteres)"
          },
          hideNumber: true,
          maxLength: 500
         }
        ],
        title: {
         default: "Sharing information with Fairtrade",
         es: "Compartir información con Fairtrade",
         fr: "Le partage d'informations avec Fairtrade",
         pt: "Compartilhamento de informações com o Fairtrade"
        }
       },
       {
        type: "panel",
        name: "fairinsight_feedback",
        elements: [
         {
          type: "rating",
          name: "rating_fairinsight",
          title: {
           default: "On a scale of 1 to 5, how easy do you find it to use FairInsight to manage your Fairtrade Premium Investments?",
           es: "En una escala del 1 al 5, ¿qué tan fácil es para usted encontrarla para usar Fairisigt para gestionar sus inversiones de Fairtrade Premium?",
           fr: "Sur une échelle de 1 à 5, dans quelle mesure trouvez-vous facile d'utiliser FairInsight pour gérer vos investissements Fairtrade Premium ?",
           pt: "Em uma escala de 1 a 5, quão fácil você acha de usar a FairInsight para administrar seus investimentos do Fairtrade Premium?"
          },
          hideNumber: true,
          minRateDescription: {
           default: "(Very Difficult)",
           es: "(Muy difícil)",
           fr: "(Très difficile)",
           pt: "(Muito Difícil)"
          },
          maxRateDescription: {
           default: "(Very Easy)",
           es: "(Muy fácil)",
           fr: "(Très facile)",
           pt: "(Muito fácil)"
          }
         },
         {
          type: "comment",
          name: "textbox_fairinsight_not_easy",
          visibleIf: "{rating_fairinsight} < 4",
          title: {
           default: "How can we improve your user experience to make managing your Fairtrade Premium Investments easier in FairInsight? (max. 500 characters)",
           es: "¿Cómo podemos mejorar su experiencia del usuario para hacer que el manejo de inversiones de Fairtrade Premium sea más fácil en FairInsight? (máx. 500 caracteres)",
           fr: "Comment pouvons-nous améliorer votre expérience utilisateur pour simplifier la gestion de vos investissements Fairtrade Premium dans FairInsight ? (max. 500 caractères)",
           pt: "Como podemos melhorar sua experiência de usuário para facilitar o gerenciamento de seus investimentos Fairtrade Premium na FairInsight? (máx. 500 caracteres)"
          },
          hideNumber: true,
          maxLength: 500
         },
         {
          type: "rating",
          name: "rating_fairinsight_usefulness",
          title: {
           default: "On a scale of 1 to 5, how useful do you see FairInsight being for your organization?",
           es: "En una escala de 1 a 5, ¿qué tan útil ve usted a FairInsight para su organización?",
           fr: "Sur une échelle de 1 à 5, dans quelle mesure FairInsight est utile pour votre organisation ?",
           pt: "Em uma escala de 1 a 5, quão útil você vê a FairInsight sendo para sua organização?"
          },
          hideNumber: true,
          minRateDescription: {
           default: "(Not at all Useful)",
           es: "(Nada útil)",
           fr: "(Pas du tout utile)",
           pt: "(Nada útil)"
          },
          maxRateDescription: {
           default: "(Very Useful)",
           es: "(Muy útil)",
           fr: "(Très utile)",
           pt: "(Muito útil)"
          }
         },
         {
          type: "comment",
          name: "textbox_fairinsight_not_useful",
          visibleIf: "{rating_fairinsight_usefulness} < 4",
          title: {
           default: "How can we make FairInsight more useful for your organization? (max. 500 characters)",
           es: "¿Cómo podemos hacer que FairInsight sea más útil para su organización? (máx. 500 caracteres)",
           fr: "Comment pouvons-nous rendre FairInsight plus utile pour votre organisation ? (max. 500 caractères)",
           pt: "Como podemos tornar a FairInsight mais útil para sua organização? (máx. 500 caracteres)"
          },
          hideNumber: true,
          maxLength: 500
         },
         {
          type: "comment",
          name: "textbox_fairinsight",
          title: {
           default: "Do you have any other comments, suggestions or feedback you would like to share with us about FairInsight? (max. 500 characters)",
           es: "¿Tiene otros comentarios, sugerencias o retroalimentación que desee compartir con nosotros acerca de FairInsight? (máx. 500 caracteres)",
           fr: "Avez-vous d'autres commentaires, suggestions ou observations que vous aimeriez partager avec nous sur FairInsight ? (max. 500 caractères)",
           pt: "Você tem algum outro comentário, sugestão ou feedback que gostaria de compartilhar conosco sobre a FairInsight? (máx. 500 caracteres)"
          },
          hideNumber: true,
          maxLength: 500
         }
        ],
        title: {
         default: "FairInsight usage",
         es: "Uso de FairInsight",
         fr: "L’utilisation de FairInsight",
         pt: "Uso FairInsight"
        }
       },
       {
        type: "panel",
        name: "thank_you_panel",
        elements: [
         {
          type: "html",
          name: "thank_you",
          html: {
           default: "<br><b>Thank you for your feedback!</b> We want to make reporting easier for you and your organization through FairInsight. We will review your inputs and keep them in mind for further improvements to the platform.",
           es: "<br><b>¡Gracias por su retroalimentación!</b> Deseamos hacer que reportar sea más fácil para usted y su organización a través de FairInsight. Revisaremos sus comentarios y los tendremos presentes para mejorar más la plataforma.",
           fr: "<br><b>Nous vous remercions pour vos commentaires !</b> Notre objectif est de simplifier la déclaration des informations pour vous et votre organisation grâce à FairInsight. Nous passerons en revue vos contributions et les garderons à l'esprit pour les améliorations futures de la plateforme.",
           pt: "<br><b>Obrigado por seu feedback!</b> Queremos facilitar a elaboração de relatórios para você e sua organização através da FairInsight. Revisaremos seus dados e os manteremos em mente para melhorias adicionais na plataforma."
          }
         }
        ]
       }
      ],
      visibleIf: "{consent_to_participate} = 'consent'",
      title: {
       default: "Your Feedback on FairInsight & Reporting Information to Fairtrade",
       es: "Su retroalimentación sobre FairInsight y la información que se reporta a Fairtrade",
       fr: "Vos commentaires sur FairInsight et la déclaration d’informations à Fairtrade",
       pt: "Seu Feedback sobre a FairInsight e Relatar informações ao Fairtrade"
      },
      navigationTitle: {
       default: "Your Feedback",
       es: "Su retroalimentación",
       fr: "Vos commentaires",
       pt: "Seu Feedback"
      }
     }
    ]
};

function screenValue(params) {
  if (!params && params.length < 1) return false;

  var question = this.question.parent.getQuestionByName(params[0]);

  if (!question) return undefined;
  var selItem = question.selectedItem;
  var res = !!selItem ? selItem.text : undefined;
  return res;
}

function App() {
  const survey = new Model(surveyJson);
  survey.focusFirstQuestionAutomatic = false;
  console.dir(survey);
  survey.onAfterRenderQuestion.add(onAfterRenderQuestion);
  survey.onDynamicPanelItemValueChanged.add(onDynamicPanelItemValueChanged);

  const alertResults = useCallback((sender) => {
    const results = JSON.stringify(sender.data);
    alert(results);
  }, []);

  survey.onComplete.add(alertResults);

  return <Survey model={survey} />;
}

export default App;
