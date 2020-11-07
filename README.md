To create project: (Only done first time)
pac pcf init --namespace D365PowerAppsComponents --name InternationalPhoneInputComponent --template field

To create solution: (Only done first time)
mkdir InternationalPhoneInputSolution
cd InternationalPhoneInputSolution
pac solution init --publisher-name "Marius_Solend" --publisher-prefix ms
pac solution add-reference --path "../"

To build Power App Component Framework Project: (pfcproj)
First time: msbuild /t:build /restore
After: msbuild

To Build Solution Project: (cdsproj)
First time: msbuild /t:build /restore
After: msbuild /t:rebuild