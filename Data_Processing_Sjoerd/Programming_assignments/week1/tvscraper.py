#!/usr/bin/env python
# Name: Sjoerd Zagema
# Student number: 12195677
# Date: 13-04-2018

"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
import requests
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
from itertools import zip_longest


TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

# making connection with libary BeautifulSoup
r  = requests.get(TARGET_URL)
soup = BeautifulSoup(r.text, 'html.parser')

# creating lists
Title = []
Rating = []
Genre = []
Actor1= []
Actor2= []
Actor3= []
Actor4= []
Runtime = []
Total_actors_temp = []
Total_actors = []

def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    #Extracting information of class: lister-item-content
    movie_containers = soup.find_all('div', class_ = "lister-item-content")

    # looping trough all the movies and adding items to lists
    for container in movie_containers:

        #Title movie
        title_name = container.h3.a.text
        Title.append(title_name)

        #Rating movie
        Rating_name = float(container.strong.text)
        Rating.append(Rating_name)

        #Genre movie
        Genre_name = container.p.find('span', class_ = 'genre').text.strip()
        Genre.append(Genre_name)

        #Movietime
        Runtime_name = container.p.find('span', class_ = 'runtime').text.split(" ")[0]
        Runtime.append(Runtime_name)

    # search in libary for atribute that ends with adv_li_st_%, to select actors
    Actor1_name = soup.select('a[href$="?ref_=adv_li_st_0"]')
    Actor2_name = soup.select('a[href$="?ref_=adv_li_st_1"]')
    Actor3_name = soup.select('a[href$="?ref_=adv_li_st_2"]')
    Actor4_name = soup.select('a[href$="?ref_=adv_li_st_3"]')

    # removing tags and creating text, adding "first actor" of each movie at the list
    for i in Actor1_name:
        only_text = i.text
        Actor1.append(only_text)

    # removing tags and creating text, adding "second actor" of each movie at the list
    for j in Actor2_name:
        only_text = j.text
        Actor2.append(only_text)

    # removing tags and creating text, adding "third actor" of each movie at the list
    for k in Actor3_name:
        only_text = k.text
        Actor3.append(only_text)

    # removing tags and creating text, adding "fourth actor" of each movie at the list
    for l in Actor4_name:
        only_text = l.text
        Actor4.append(only_text)

    # temporaly combining all actors lists into a list
    Total_actors_temp = [Actor1, Actor2, Actor3, Actor4]

    # connecting the actors to the corresponding movie and filling list "Total_actors"
    for i in range(50):
        list_total_actors = [item[i] for item in Total_actors_temp]
        Total_actors.append(list_total_actors)

    # returning lists
    return[Title, Rating, Genre, Total_actors, Runtime]

def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    # obtaining lists and writing into rows which begin with a new line
    tvseries = [Title, Rating, Genre, Total_actors, Runtime]
    outfile = zip_longest(*tvseries, fillvalue = '')
    with open('tvseries.csv', 'w', newline='') as myfile:
        writer = csv.writer(myfile)
        writer.writerow(('Title', 'Rating', 'Genre', 'Actors', 'Runtime'))
        writer.writerows(outfile)
    myfile.close()

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)
