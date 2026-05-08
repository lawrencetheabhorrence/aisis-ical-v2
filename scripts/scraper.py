# honestly won't work all the time
import re
import unicodedata
from bs4 import BeautifulSoup
import requests as r
import datetime as dt
import os
import csv
from pathlib import Path
from fake_useragent import UserAgent

present_year = dt.date.today().year
school_years = [
    f"{present_year - 1}-{present_year}",
    f"{present_year}-{present_year + 1}",
]


def get_csv_path(sy: str):
    return Path(".") / f"{sy}-dates.csv"


def get_html_path(sy: str):
    return Path(".") / f"academic-calendar-{sy}.html"


def fetch_calendar(sy):
    ua = UserAgent()
    req = r.get(
        f"https://www.ateneo.edu/registrar/academic-calendar/{sy}",
        headers={"User-Agent": ua.random},
    )
    if req.status_code == 200:
        with open(get_html_path(sy), "w") as f:
            f.write(req.text)
    else:
        raise ConnectionError("Fetch failed")


def get_dates_from_row(first_cell_text, soup):
    first_cell = soup.find(re.compile(r".+"), string=re.compile(first_cell_text))
    row = first_cell.find_parent("tr")
    row_strings = list(row.stripped_strings)

    date_strings = []
    for rs in row_strings[1:]:
        normalized = unicodedata.normalize("NFKD", rs)
        no_day_of_week = normalized.split(",")[0]
        compressed_spaces = re.sub(r"\s+", " ", no_day_of_week)
        date_strings.append(compressed_spaces)

    return date_strings


def get_dates_from_calendar(sy, calendar_html):
    cal_html_text = ""
    with open(calendar_html, "r") as cal_html:
        cal_html_text = cal_html.read()

    if len(cal_html_text) > 0:
        cal_html_text = unicodedata.normalize("NFD", cal_html_text)
        print("parsing for ", sy)
        soup = BeautifulSoup(cal_html_text, "html.parser")
        start_dates = get_dates_from_row(r"Start of the Semester/Term", soup)
        print(start_dates)
        end_class_dates = get_dates_from_row(
            re.compile(r"Last day of regular classes.+"), soup
        )
        # print(end_class_dates)
        end_dates = get_dates_from_row(r"Last day of the Semester/Term", soup)
        print(end_dates)

        with open(get_csv_path(sy), "w") as dates_csv:
            print("Writing csv for ", sy)
            dates_writer = csv.writer(dates_csv, delimiter=",")
            dates_writer.writerow(["Time of Sem", "Sem 0", "Sem 1", "Sem 2"])
            dates_writer.writerow(["Start"] + start_dates)
            dates_writer.writerow(["End of classes"] + end_class_dates)
            dates_writer.writerow(["End"] + end_dates)


for sy in school_years:
    if os.path.exists(get_csv_path(sy)):
        continue

    if not (os.path.exists(get_html_path(sy))):
        try:
            fetch_calendar(sy)
        except ConnectionError:
            print("Failed to fetch calendar")
            continue

    get_dates_from_calendar(sy, get_html_path(sy))
