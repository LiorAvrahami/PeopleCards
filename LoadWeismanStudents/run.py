import re

locate_person = re.compile("<div class=\"image-wrapper\">\n"
                           ".*?<img src=\"(.*?)\".*?\n"
                           ".*?\n"
                           ".*?\n"
                           ".*?<h2>(.*?)</h2>")

with open("input.html","r",encoding="utf-8") as f:
    weiz_html = f.read()

out_text = ""

for person_match in locate_person.finditer(weiz_html):
    print(person_match.groups())
    out_text += person_match.group(2) + "\n" + person_match.group(1) + "\n\n"

with open("output.txt","w+",encoding="utf-8") as f:
    f.write(out_text)