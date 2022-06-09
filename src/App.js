import { useCallback } from "react";

import "survey-core/defaultV2.min.css";
// import 'survey-core/survey.min.css';
import { StylesManager, Model } from "survey-core";
import { Survey } from "survey-react-ui";

StylesManager.applyTheme("defaultV2");

const surveyJson = {
  version: 1,
  logoPosition: "right",
  focusOnFirstError: false,
  progressBarType: "buttons",
  showProgressBar: "top",
  pages: [
    {
      name: "Start page",
      navigationTitle: "Start page",
      navigationDescription: "Producer Profile",
      elements: [
        {
          type: "panel",
          name: "panel1",
          elements: [
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
                  text:
                    "Small-scale producer organization or Contract production"
                },
                {
                  value: "hlo",
                  text: "Hired labor plantation"
                }
              ]
            },
            {
              type: "radiogroup",
              name: "organic_logic",
              title:
                "Were some or all of your products under Fairtrade certification also produced under an organic certification in the last calendar/ production year?",
              choices: [
                {
                  value: "item1",
                  text:
                    "Some products (both organic and conventional production)"
                },
                {
                  value: "item2",
                  text: "None of the products (only conventional production)"
                },
                {
                  value: "item3",
                  text: "All products (only organic production)"
                }
              ]
            }
          ]
        }
      ],
      description: "Producer Profile"
    },
    {
      name: "Land area",
      navigationTitle: "Land area",
      navigationDescription: "Under cultivation",
      elements: [
        {
          type: "matrixdynamic",
          name: "land_product_tree",
          title:
            "Please indicate the products that your organization produced according to the Fairtrade standards in the last calendar/ production year. Use the left-hand column to filter for the product(s).",
          columns: [
            {
              name: "product_category_major",
              title: "Major product category",
              cellType: "dropdown",
              choices: [
                {
                  value: 1,
                  text: "Coffee"
                },
                {
                  value: 2,
                  text: "Cocoa"
                },
                {
                  value: 3,
                  text: "Bananas"
                }
              ],
              storeOthersAsComment: true
            },
            {
              name: "product_category_minor",
              title: "Minor product category",
              cellType: "dropdown",
              choices: [
                {
                  value: 1,
                  text: "Coffee arabica"
                },
                {
                  value: 2,
                  text: "Coffee robusta"
                },
                {
                  value: 3,
                  text: "Cocoa"
                },
                {
                  value: 4,
                  text: "Bananas"
                }
              ],
              storeOthersAsComment: true
            }
          ]
        },
        {
          type: "radiogroup",
          name: "land_area_unit",
          title:
            "What is the unit in which you would like to report your land area?",
          choices: [
            {
              value: "ha",
              text: "hectares"
            },
            {
              value: "acre",
              text: "acres"
            }
          ]
        },
        {
          type: "panel",
          name: "land_area_panel",
          elements: [
            {
              type: "text",
              name: "total_land_managed",
              title:
                "What is the total land area in {land_area_unit} under cultivation by all SPO members (land under cultivation of both Fairtrade and non-Fairtrade certified crops)? ",
              inputType: "number"
            },
            {
              type: "text",
              name: "total_area_ft_certification",
              startWithNewLine: false,
              title:
                "What is the total land area in {land_area_unit} under cultivation with Fairtrade crops within your organization?",
              validators: [
                {
                  type: "expression",
                  text:
                    "Fairtrade land area is larger than total land area. Please fix.",
                  expression:
                    "{total_land_managed} >= {total_area_ft_certification}"
                }
              ],
              inputType: "number"
            }
          ]
        },
        {
          type: "matrixdropdown",
          name: "land_area_production_matrix",
          title:
            "Record the land area in {land_area_unit} under cultivation of Fairtrade crops for each Fairtrade-certified product. If the area is not known, indicate so with the checkboxes. Note, if your organization produces honey, please report the number of beehives instead of land area.",
          columns: [
            {
              name: "land_area_known",
              title:
                "Do you know the land area under cultivation of each product?",
              cellType: "boolean",
              minWidth: "180px",
              defaultValue: "false",
              labelTrue: "No",
              labelFalse: "Yes",
              showTitle: true
            },
            {
              name: "land_total_production",
              title: "Total land area in {land_area_unit} by product",
              cellType: "text",
              minWidth: "150px",
              visibleIf: "{row.land_area_known}=false",
              inputType: "number"
            },
            {
              name: "land_area_known_attribute",
              title:
                "Do you know the conventional and/or organic land area under cultivation of each product?",
              cellType: "boolean",
              minWidth: "200px",
              defaultValue: "false",
              labelTrue: "No",
              labelFalse: "Yes",
              showTitle: true
            },
            {
              name: "land_conventional_production",
              title:
                "Land area in {land_area_unit} under conventional cultivation",
              cellType: "text",
              minWidth: "150px",
              visibleIf: "{row.land_area_known_attribute}=false",
              inputType: "number"
            },
            {
              name: "land_organic_production",
              title: "Land area in {land_area_unit} under organic cultivation",
              cellType: "text",
              minWidth: "150px",
              visibleIf: "{row.land_area_known_attribute}=false",
              inputType: "number"
            }
          ],
          horizontalScroll: true,
          rows: [
            {
              value: "Row 1",
              text: "[Product 1]"
            },
            {
              value: "Row 2",
              text: "[Product 2]"
            }
          ],
          rowTitleWidth: "150px"
        }
      ],
      description: "Land Area Under Cultivation"
    },
    {
      name: "Production",
      navigationTitle: "Production",
      navigationDescription: "Volumes produced & forecasts",
      elements: [
        {
          type: "matrixdropdown",
          name: "volumes_produced_matrix",
          title:
            "Record the conventional and organic volumes produced under Fairtrade certification in the last calendar/production year for each product. If production volume is estimated, please specify how you came to this estimate.",
          columns: [
            {
              name: "product_form_name",
              title: "What product form are you reporting your production in?",
              cellType: "dropdown",
              minWidth: "300px",
              choices: [
                {
                  value: 1,
                  text: "Arabica washed parchment"
                },
                {
                  value: 2,
                  text: "Arabica cherry"
                },
                {
                  value: 3,
                  text: "Baby bananas"
                },
                {
                  value: 4,
                  text: "Cocoa beans raw"
                }
              ],
              storeOthersAsComment: true
            },
            {
              name: "volume_produced_unit",
              title: "What unit are you reporting your production in?",
              cellType: "dropdown",
              minWidth: "180px",
              choices: [
                {
                  value: "item1",
                  text: "kg"
                },
                {
                  value: "item2",
                  text: "MT"
                },
                {
                  value: "item3",
                  text: "Boxes 18.14 kg"
                },
                {
                  value: "item4",
                  text: "Items"
                }
              ]
            },
            {
              name: "volume_conventional_produced",
              title: "Volume produced under conventional cultivation",
              cellType: "text",
              minWidth: "180px",
              inputType: "number"
            },
            {
              name: "volume_organic_produced",
              title: "Volume produced under organic cultivation",
              cellType: "text",
              minWidth: "180px",
              inputType: "number"
            },
            {
              name: "volume_produced_estimated_or_measured",
              title: "Are the volumes reported actual or estimates?",
              cellType: "boolean",
              minWidth: "150px",
              defaultValue: "false",
              labelTrue: "Actual",
              labelFalse: "Estimates",
              showTitle: true
            },
            {
              name: "estimation_method",
              title: "Volumes were estimated based on:",
              cellType: "dropdown",
              minWidth: "200px",
              visibleIf: "{row.estimate_actual}=false",
              visible: false,
              choices: [
                {
                  value: 1,
                  text: "Yields"
                },
                {
                  value: 2,
                  text: "Purchases from members",
                  visibleIf: "{producer_setup}=spo"
                },
                {
                  value: 3,
                  text: "Fairtrade sales"
                },
                {
                  value: 4,
                  text: "Total sales"
                }
              ],
              storeOthersAsComment: true
            }
          ],
          choices: [
            {
              value: 1,
              text: "Yields"
            },
            {
              value: 2,
              text: "Purchases from members",
              visibleIf: "{producer_setup}=spo"
            },
            {
              value: 3,
              text: "Fairtrade sales"
            },
            {
              value: 4,
              text: "Total sales"
            }
          ],
          rows: [
            {
              value: "Row 1",
              text: "[Minor category 1]"
            },
            {
              value: "Row 2",
              text: "[Minor category 2]"
            }
          ],
          rowTitleWidth: "200px"
        },
        {
          type: "matrixdropdown",
          name: "volumes_forecast_matrix",
          title:
            "How much of the total volume produced this year does your organization have on offer that is of export quality for Fairtrade sales? Record the conventional and organic volumes. If you have already started selling, record the volume your organization had on offer at the beginning of this calendar year.",
          columns: [
            {
              name: "product_form_name_forecast",
              title: "Production type",
              cellType: "dropdown",
              minWidth: "300px",
              choices: [
                {
                  value: 1,
                  text: "Arabica washed parchment"
                },
                {
                  value: 2,
                  text: "Arabica cherry"
                },
                {
                  value: 3,
                  text: "Baby bananas"
                },
                {
                  value: 4,
                  text: "Cocoa beans raw"
                }
              ],
              storeOthersAsComment: true
            },
            {
              name: "volume_forecast_unit",
              title: "Unit",
              cellType: "dropdown",
              minWidth: "180px",
              choices: [
                {
                  value: "item1",
                  text: "kg"
                },
                {
                  value: "item2",
                  text: "MT"
                },
                {
                  value: "item3",
                  text: "Boxes 18.14 kg"
                },
                {
                  value: "item4",
                  text: "Items"
                }
              ]
            },
            {
              name: "volume_conventional_forecast",
              title: "Conventional volume on offer",
              cellType: "text",
              minWidth: "180px",
              inputType: "number"
            },
            {
              name: "volume_organic_forecast",
              title: "Organic volume on offer",
              cellType: "text",
              minWidth: "180px",
              inputType: "number"
            }
          ],
          rows: [
            {
              value: "Row 1",
              text: "[Minor category 1]"
            },
            {
              value: "Row 2",
              text: "[Minor category 2]"
            }
          ],
          rowTitleWidth: "200px"
        }
      ],
      description: "Production"
    }
  ],
  checkErrorsMode: "onValueChanged"
};

function App() {
  const survey = new Model(surveyJson);
  survey.focusFirstQuestionAutomatic = false;

  const alertResults = useCallback((sender) => {
    const results = JSON.stringify(sender.data);
    alert(results);
  }, []);

  survey.onComplete.add(alertResults);

  return <Survey model={survey} />;
}

export default App;
