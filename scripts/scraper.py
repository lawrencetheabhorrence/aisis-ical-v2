# honestly won't work all the time
import re
import unicodedata
from bs4 import BeautifulSoup
import requests as r
import datetime as dt
import os
import csv
from fake_usergent import UserAgent

present_year = dt.date.today().year
school_years = [
    f"{present_year - 1}-{present_year}",
    f"{present_year}-{present_year + 1}",
]


def fetch_calendar(sy):
    ua = UserAgent()
    req = r.get(
        "https://www.ateneo.edu/registrar/academic-calendar/2026-2027",
        headers={"User-Agent": ua.random},
    )
    if req.status_code == 200:
        with open(f"./{sy}-backup.html") as f:
            f.write(req.text)


def get_dates_from_row(first_cell_text, soup):
    first_cell = soup.find(re.compile(r".+"), string=first_cell_text)
    row = first_cell.parent.parent
    row_strings = list(row.stripped_strings)

    date_strings = []
    for rs in row_strings[1:]:
        normalized = unicodedata.normalize("NFKD", rs)
        no_day_of_week = normalized.split(",")[0]
        compressed_spaces = re.sub(r"\s+", " ", no_day_of_week)
        date_strings.append(compressed_spaces)

    return date_strings


def get_dates_from_calendar(sy, calendar_html):
    with open(calendar_html, "r") as cal_html:
        cal_html_text = cal_html.read()
        soup = BeautifulSoup(cal_html_text)
        start_dates = get_dates_from_row("Start of the Semester/Term", soup)
        end_class_dates = get_dates_from_row(
            "Last day of regular classes for the   Semester/Term", soup
        )
        end_dates = get_dates_from_row("Last day of the Semester/Term", soup)

        with open(f"./{sy}-dates.csv", "w") as dates_csv:
            dates_writer = csv.writer(dates_csv, delimiter=",")
            dates_writer.writerow(["Time of Sem", "Sem 0", "Sem 1", "Sem 2"])
            dates_writer.writerow(["Start"] + start_dates)
            dates_writer.writerow(["End of classes"] + end_class_dates)
            dates_writer.writerow(["End"] + end_dates)


for sy in school_years:
    if os.path.exists(f"./{sy}-dates.csv"):
        continue
    if not (os.path.exists(f"./{sy}-backup.html")):
        html_calendar = fetch_calendar(sy)
    else:
        with open(f"./{sy}-backup.html") as html_cal_file:
            html_calendar = html_cal_file.read()

    get_dates_from_calendar(sy, html_calendar)
