To create project: (Only done first time)
pac pcf init --namespace D365PowerAppComponents --name ReactSampleControl --template field

To create solution: (Only done first time)
mkdir INPowerAppComponents
cd INPowerAppComponents
pac solution init --publisher-name crminsight --publisher-prefix ci
pac solution add-reference --path "../"

To build Power App Component Framework Project: (pfcproj)
First time: msbuild /t:build /restore
After: msbuild

To Build Solution Project: (cdsproj)
First time: msbuild /t:build /restore
After: msbuild /t:rebuild

To debug specific control:
npx pcf-start --codePath "./out/controls/*ControlName*"