import Grid from "@material-ui/core/Grid";

import {
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";

import InputBase from "@material-ui/core/InputBase";

import moment from "moment";
import React, { useState, useEffect } from "react";
import Select from "react-select";

const Movies = () => {
  const [movieList, setMovieList] = useState();
  const [characterList, setCharacterList] = useState();
  const [character, setCharacter] = useState();
  const [loader, setLoader] = useState(true);
  const [latestMovie, setLatestMovie] = useState(null);

  const fetchCharacterNames = () => {
    setLoader(true);
    fetch("https://swapi.dev/api/people")
      .then((response) => response.json())
      .then((data) => {
        setLoader(false);
        let tempNames = [];
        data.results.forEach((movie, index) => {
          tempNames.push({ value: index, label: movie["name"] });
        });
        setCharacterList(tempNames);
      });
  };
  useEffect(() => {
    fetchCharacterNames();
  }, []);

  const fetchMovieList = (char) => {
    setCharacter(char);
    setLoader(true);
    fetch("https://swapi.dev/api/people/" + (char.value + 1))
      .then((response) => response.json())
      .then(async (data) => {
        let tempMovies = [];
        let years = [];
        for (const el of data.films) {
          const response = await fetch(el);
          const movies = await response.json();
          //console.log(movies);
          tempMovies.push(movies.title);
          years.push(Date.parse(movies.release_date));
        }

        const maxDate = years.indexOf(Math.max(...years));
        setLoader(false);
        setMovieList(tempMovies);
        setLatestMovie({
          name: tempMovies[maxDate],
          year: new Date(years[maxDate]),
        });
      });
  };

  return (
    <div
      style={{
        position: "absolute",    
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        padding: "100px",
        backgroundColor: "#FFFFFF",
        margin: "20px",
        height: "400px",
        width: "40%",
      }}
    >
      {loader ? (
        <CircularProgress />
      ) : (
        <>
      
          <Typography variant="h6"  align="left" >Characters of Movie:</Typography>
          <Select
            value={character}
            options={characterList}
            onChange={fetchMovieList}
          />
           <Typography   align="left" > List of Movies:</Typography>
          <div style={{ borderStyle: "ridge", marginBottom: "15px" }}>
            <Box boxShadow={0} borderRadius={16}>
              <List>
                {movieList?.map((name) => {
                  return (
                    <ListItem button>
                      <ListItemText
                        color="secondary"
                        key={name.id}
                        primary={name}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </div>
          <div style={{ borderStyle: "ridge" }}>
            <Typography align="left" color="textPrimary">
              Name of Latest Movie:  {latestMovie?.name} <br />
              Year Released:             
               {latestMovie?.year
                ? moment(latestMovie?.year).format("YYYY")
                : null}
            </Typography>
          </div>
        </>
      )}
    </div>
  );
};

export default Movies;
