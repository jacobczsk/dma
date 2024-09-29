import json, dateutil, subprocess, base64, sys, requests

source = {"": "Flatbed", "A": "ADF"}
REG = "LLI0902"

subprocess.run(["clear"])

if __name__ == "__main__":
    with open("web/maps/maps.json", "r+") as f:
        mj = json.loads(f.read())

        while True:
            try:
                oris_id = input("ORIS ID (leave blank for manual): ")
                if oris_id != "":
                    eventData = requests.get(
                        f"https://oris.orientacnisporty.cz/API/?format=json&method=getEvent&id={oris_id}"
                    ).json()["Data"]

                    race_name = input(
                        f"Race name (leave blank for '{eventData["Name"]}'): "
                    )
                    if race_name == "":
                        race_name = eventData["Name"]

                    race_date = dateutil.parser.parse(eventData["Date"])
                    print(f"Race date: {race_date.strftime("%d. %m. %Y")}")

                    race_location = input(
                        f"Race location (leave blank for '{eventData["Place"]}'): "
                    )
                    if race_location == "":
                        race_location = eventData["Place"]

                    resultsData = requests.get(
                        f"https://oris.orientacnisporty.cz/API/?format=json&method=getEventResults&eventid={oris_id}"
                    ).json()["Data"]

                    try:
                        person = list(
                            filter(lambda x: x["RegNo"] == REG, resultsData.values())
                        )[0]
                    except IndexError:
                        print("Person not found in race")
                        exit()

                    race_class = person["ClassDesc"]
                    print(f"Class: {race_class}")

                    race_time = person["Time"]
                    print(f"Time: {race_time}")

                    race_loss = person["Loss"].replace(" ", "")
                    print(f"Loss: {race_loss}")

                    race_place = person["Place"]
                    print(f"Place: {race_place}")

                else:
                    race_name = input("Race name (q to exit): ")
                    if race_name == "q":
                        break
                    race_date = dateutil.parser.parse(
                        input("Race date: "), dayfirst=True
                    )
                    print(f"Date check: {race_date.strftime("%d. %m. %Y")}")
                    race_location = input("Race location: ")
                    race_class = input("Class: ")
                    race_time = input("Time: ")
                    race_loss = input("Loss: ")
                    race_place = input("Place: ")
                
                source = input(
                    "Source (nothing for flatbed, A for ADF) and start scan (nothing for append, R for rewrite)"
                )

                filename = f"maps/img/{f"{race_date.strftime("%Y-%m-%d")}_{base64.urlsafe_b64encode(race_name.encode()).decode()}"}.jpg"

                subprocess.run(
                    [
                        "scanimage",
                        f"--device={sys.argv[1]}",
                        "--progress",
                        f"--source={source.replace("R", "")}",
                        "--resolution=200dpi",
                        "-x 210.0",
                        "-y 297.0",
                        "--compression=JPEG",
                        "--format=jpeg",
                        "--mode=Color",
                        f"--output-file=web/{filename}",
                    ]
                )
                print("Scan complete\n")

                if not "R" in source:
                    mj["maps"].append(
                        {
                            "name": race_name,
                            "date": race_date.isoformat(),
                            "location": race_location,
                            "time": race_time,
                            "class": race_class,
                            "place": race_place,
                            "loss": race_loss,
                            "file": filename,
                        }
                    )
                    f.seek(0)
                    f.truncate()
                    f.write(json.dumps(mj))

            except Exception as e:
                print(e)
            except KeyboardInterrupt:
                ...
