import json
import us

# Create map from AP abbreviations to 2 letter USPS abbreviations
state_mapping = us.states.mapping('name', 'abbr')

final_list = []

for state in state_mapping:
  state_abbr = state_mapping[state]
  print state_abbr
  state_dict = {
    "full_name": state,
    "abbr": state_abbr
  }
  final_list.append(state_dict)

with open("state-list.json", "w") as f:
  json.dump(final_list, f)
