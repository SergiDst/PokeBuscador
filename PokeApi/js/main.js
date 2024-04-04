$(document).ready(function () {
    var artyom = new Artyom();

    var nombres = []

    $.ajax({
        url: "https://pokeapi.co/api/v2/pokemon-species/?offset=0&limit=1025",
        contentType: "application/json",
        success: function (data) {
            for (var i = 0; i < data.results.length; i++) {
                nombres.push(data.results[i].name)
            }

        }
    })

    //console.log(nombres)


    $("#buscar").on("click", function () {
        $.ajax({
            url: "https://pokeapi.co/api/v2/pokemon-species/" + $("#label").val().toLowerCase(),
            contentType: "application/json",
            success: function (species) {
                for (var i = 0; i < species.varieties.length; i++) {
                    if (species.varieties[i].is_default == true) {
                        var pokeUrl = species.varieties[i].pokemon.url
                        $.ajax({
                            url: pokeUrl,
                            contentType: "application/json",
                            success: function (data) {
                                //CARGAR STATS
                                cargarStats(data)
                                //FIN STATS

                                //cargar TIPOS
                                cargarTipos(data)
                                //FIN TIPOS

                                //INICIO HABILIDADES
                                cargarHabilidades(data)

                                //FIN HABILIDADES

                                //CARGAR POKE
                                cargarPoke(data)
                                //FIN CARGAR POKE

                                //INICIO MEGAS Y GMAX
                                $.ajax({
                                    url: "https://pokeapi.co/api/v2/pokemon-species/" + $("#label").val().toLowerCase(),
                                    contentType: "application/json",
                                    success: function (species) {
                                        var mega = 0
                                        var gmax = 0
                                        for (var i = 0; i < species.varieties.length; i++) {
                                            var forma = species.varieties[i].pokemon.name
                                            if (species.varieties[i].is_default != true) {
                                                if (forma.includes("gmax")) {
                                                    gmax++
                                                    $("#btnGmax").prop("disabled", false)
                                                    $("#FormaGmax").html(`<p>${forma}</p>`)
                                                    $("#NumGmax").html(gmax)
                                                } else if (forma.includes("mega")) {
                                                    mega++
                                                    $("#btnMega").prop("disabled", false)
                                                    if (forma.includes("mega-y")) {
                                                        $("#FormaMegaY").html(`<p>${forma}</p>`)
                                                    } else {
                                                        $("#FormaMega").html(`<p>${forma}</p>`)
                                                    }
                                                    $("#NumMegas").html(mega)
                                                } else if (!(forma.includes("gmax")) || !(forma.includes("gmax"))) {
                                                    $("#btnForma").prop("disabled", false)
                                                    $("#NumPoke").html(`<p>${forma}</p>`)
                                                }
                                            } else if (species.varieties[i].is_default == true) {
                                                $("#NomForma").html(`<p>${forma}</p>`)
                                                $("#FormaGmax").html(`<p></p>`)
                                                $("#FormaMega").html(`<p></p>`)
                                                $("#FormaMegaY").html(`<p></p>`)
                                                $("#NumGmax").html(0)
                                                $("#NumMegas").html(0)
                                            }
                                        }
                                    }
                                })
                                //FIN MEGAS Y GMAX

                                cargarEntrada()
                            }
                        })
                    }
                }

            }, error: function () {
                cargarError()
            }
        })
    })

    $("#btnVoz").on("click", function () {

        artyom.initialize({
            lang: "es-ES",
            debug: true,
            listen: true,
            continuous: false,
            soundex: true,
            speed: 0.9,
            mode: "normal"
        })

        artyom.addCommands({
            indexes: nombres,
            action: function (i) {
                artyom.say("¿Estas buscando al Pokemon: " + this.indexes[i] + "? Si es asi presiona el boton buscar")
                $("#label").val(this.indexes[i]);
            }
        })

        //artyom.say("Zygarde")


        setTimeout(function () {
            artyom.fatality()
        }, 3000)
    })

    $("#btnShiny").on("click", function () {
        $("#Poke").addClass("gif")
        setTimeout(function () {
            $("#Poke").removeClass("gif");
        }, 1500);
        var poke = $("#NomForma").text();
        //console.log(poke)
        $.ajax({
            url: "https://pokeapi.co/api/v2/pokemon/" + poke,
            contentType: "application/json",
            success: function (data) {
                if (data.sprites.other["official-artwork"].front_shiny == null) {
                    $('#modalnoEncontrado').modal('show');
                    $("#btnShiny").prop("disabled", true);
                } else {
                    $("#audio").html(`<source src="${data.cries.latest}" type="audio/ogg">`)
                    $("#audio")[0].load()
                    $("#Poke").html(`<img src="${data.sprites.other["official-artwork"].front_shiny}">`)
                }

            }
        })
    })

    $("#btnGrito").on("click", function () {
        var poke = $("#NomForma").text();
        $.ajax({
            url: "https://pokeapi.co/api/v2/pokemon/" + poke,
            contentType: "application/json",
            success: function (data) {
                $("#audio").html(`<source src="${data.cries.latest}" type="audio/ogg">`)
                $("#audio")[0].load()
                $("#audio")[0].play()
            }
        })
    })

    $("#btnGmax").on("click", function () {
        var poke = ""
        $("#Poke").addClass("gmaxAnim")
        setTimeout(function () {
            $("#Poke").removeClass("gmaxAnim");
        }, 2500);
        var numGmax = $("#NumGmax").text();
        if (numGmax == 2) {
            poke = $("#NomForma").text();
            $.ajax({
                url: "https://pokeapi.co/api/v2/pokemon/" + poke + "-gmax",
                contentType: "application/json",
                success: function (data) {
                    cargarStats(data)
                    cargarTipos(data)
                    cargarHabilidades(data)
                    $("#Poke").html(`<img src="${data.sprites.other["official-artwork"].front_default}">`)
                    $("#NomForma").html(`<p>${data.forms[0].name}</p>`)
                    $("#btnGmax").prop("disabled", true);
                    $("#peso").html(`<p>Peso: ${data.weight} kg</p>`)
                    $("#altura").html(`<p>Altura: ${data.height} ft</p>`)

                }
            })
        } else {
            poke = $("#FormaGmax").text();
            //console.log(poke)
            $.ajax({
                url: "https://pokeapi.co/api/v2/pokemon/" + poke,
                contentType: "application/json",
                success: function (data) {
                    cargarStats(data)
                    cargarTipos(data)
                    cargarHabilidades(data)
                    $("#Poke").html(`<img src="${data.sprites.other["official-artwork"].front_default}">`)
                    $("#NomForma").html(`<p>${data.forms[0].name}</p>`)
                    $("#btnGmax").prop("disabled", true);
                    $("#peso").html(`<p>Peso: ${data.weight} kg</p>`)
                    $("#altura").html(`<p>Altura: ${data.height} ft</p>`)

                }
            })
        }

    })

    $("#btnForma").on("click", function () {
        var poke = $("#NumPoke").text();
        //console.log(poke)
        $.ajax({
            url: "https://pokeapi.co/api/v2/pokemon/" + poke,
            contentType: "application/json",
            success: function (data) {
                $("#Poke").addClass("formaAnim")
                setTimeout(function () {
                    $("#Poke").removeClass("formaAnim");
                }, 2500);
                cargarStats(data)
                cargarTipos(data)
                cargarHabilidades(data)
                if (data.sprites.other["official-artwork"].front_default == null) {
                    $('#modalnoEncontrado').modal('show');
                    $("#btnForma").prop("disabled", true);
                } else {
                    $("#Poke").html(`<img src="${data.sprites.other["official-artwork"].front_default}">`)
                    $("#NomForma").html(`<p>${data.forms[0].name}</p>`)
                    $("#btnForma").prop("disabled", true);
                    $("#peso").html(`<p>Peso: ${data.weight} kg</p>`)
                    $("#altura").html(`<p>Altura: ${data.height} ft</p>`)
                }

                //$("#btnMega").prop("disabled", false);
            }
        })
    })

    $("#btnMega").on("click", function () {
        var numMegas = $("#NumMegas").text();
        //console.log(numMegas)
        if (numMegas == 2) {
            //console.log("entro")
            $('#modalMega').modal('show');
            $("#Mega").on("click", function () {
                $("#Poke").addClass("megaAnim")
                setTimeout(function () {
                    $("#Poke").removeClass("megaAnim");
                }, 1500);
                $('#modalMega').modal('hide')
                //console.log("entro en mega x")
                var poke = $("#FormaMega").text();
                $.ajax({
                    url: "https://pokeapi.co/api/v2/pokemon/" + poke,
                    contentType: "application/json",
                    success: function (data) {
                        cargarStats(data)
                        cargarTipos(data)
                        cargarHabilidades(data)
                        $("#Poke").html(`<img src="${data.sprites.other["official-artwork"].front_default}">`)
                        $("#NomForma").html(`<p>${data.forms[0].name}</p>`)
                        $("#peso").html(`<p>Peso: ${data.weight} kg</p>`)
                        $("#altura").html(`<p>Altura: ${data.height} ft</p>`)
                    }
                })
            })
            $("#MegaY").on("click", function () {
                $("#Poke").addClass("megaAnim")
                setTimeout(function () {
                    $("#Poke").removeClass("megaAnim");
                }, 1500);
                $('#modalMega').modal('hide')
                //console.log("entro en mega Y")
                var poke = $("#FormaMegaY").text();
                $.ajax({
                    url: "https://pokeapi.co/api/v2/pokemon/" + poke,
                    contentType: "application/json",
                    success: function (data) {
                        cargarStats(data)
                        cargarTipos(data)
                        cargarHabilidades(data)
                        $("#Poke").html(`<img src="${data.sprites.other["official-artwork"].front_default}">`)
                        $("#NomForma").html(`<p>${data.forms[0].name}</p>`)
                        $("#btnMega").prop("disabled", true);
                        $("#peso").html(`<p>Peso: ${data.weight} kg</p>`)
                        $("#altura").html(`<p>Altura: ${data.height} ft</p>`)
                    }
                })
            })
        } else {
            $("#Poke").addClass("megaAnim")
            setTimeout(function () {
                $("#Poke").removeClass("megaAnim");
            }, 1500);
            //console.log("una mega")
            var poke = $("#FormaMega").text();
            $.ajax({
                url: "https://pokeapi.co/api/v2/pokemon/" + poke,
                contentType: "application/json",
                success: function (data) {
                    cargarStats(data)
                    cargarTipos(data)
                    cargarHabilidades(data)
                    $("#Poke").html(`<img src="${data.sprites.other["official-artwork"].front_default}">`)
                    $("#NomForma").html(`<p>${data.forms[0].name}</p>`)
                    $("#btnMega").prop("disabled", true);
                    $("#peso").html(`<p>Peso: ${data.weight} kg</p>`)
                    $("#altura").html(`<p>Altura: ${data.height} ft</p>`)
                }
            })
        }

    })

    function cargarEntrada() {

        artyom.initialize({
            lang: "es-ES",
            debug: true,
            listen: true,
            continuous: false,
            soundex: true,
            speed: 0.9,
            mode: "normal"
        })

        $.ajax({
            url: "https://pokeapi.co/api/v2/pokemon-species/" + $("#label").val().toLowerCase(),
            contentType: "application/json",
            success: function (species) {
                var txt = "hola"
                for (var i = 0; i < species.flavor_text_entries.length; i++) {
                    var idioma = species.flavor_text_entries[i].language.name
                    if (idioma == "es") {
                        $("#txtEntrada").html(`<p>${species.flavor_text_entries[i].flavor_text}</p>`)
                        $('#modalEntrada').modal('show');
                        txt = species.flavor_text_entries[i].flavor_text;
                    }
                }
                //console.log(txt)
                artyom.say(txt);
            }
        })

        $(".callar").on("click", function () {
            artyom.shutUp()
        })

        setTimeout(function () {
            artyom.fatality()
        }, 1000)
    }
})

function cargarStats(data) {
    for (var j = 0; j < data.stats.length; j++) {
        var statName = data.stats[j].stat.name;
        var baseStat = data.stats[j].base_stat;

        switch (statName) {
            case "hp":
                actualizarAncho("#statHp", baseStat);
                $("#statHp").html(`${baseStat}`)
                break;
            case "attack":
                actualizarAncho("#statAtk", baseStat);
                $("#statAtk").html(`${baseStat}`)
                break;
            case "defense":
                actualizarAncho("#statDef", baseStat);
                $("#statDef").html(`${baseStat}`)
                break;
            case "special-attack":
                actualizarAncho("#statSpAtk", baseStat);
                $("#statSpAtk").html(`${baseStat}`)
                break;
            case "special-defense":
                actualizarAncho("#statSpDef", baseStat);
                $("#statSpDef").html(`${baseStat}`)
                break;
            case "speed":
                actualizarAncho("#statSpd", baseStat);
                $("#statSpd").html(`${baseStat}`)
                break;
            default:

                break;
        }
    }
}

function actualizarAncho(selector, valor) {
    $(selector).css("width", `calc(100% * ${valor}/257)`)
}

function cargarTipos(data) {
    for (var i = 0; i < data.types.length; i++) {
        var typeName = data.types[i].type.name;

        if (data.types[i].slot == 1) {
            actualizarImagenTipo("#imagenTipo", typeName);
            $("#imagenTipo2").html(`<img src="">`);
        } else {
            actualizarImagenTipo("#imagenTipo2", typeName);
        }
    }
}

function actualizarImagenTipo(selector, typeName) {
    var imagenSrc;
    switch (typeName) {
        case "steel":
            imagenSrc = "images/Acero.png";
            break;
        case "poison":
            imagenSrc = "images/Veneno.png";
            break;
        case "fire":
            imagenSrc = "images/Fuego.png";
            break;
        case "grass":
            imagenSrc = "images/Planta.png";
            break;
        case "water":
            imagenSrc = "images/Agua.png";
            break;
        case "bug":
            imagenSrc = "images/Bicho.png";
            break;
        case "dragon":
            imagenSrc = "images/Dragon.png";
            break;
        case "electric":
            imagenSrc = "images/Electrico.png";
            break;
        case "ghost":
            imagenSrc = "images/Fantasma.png";
            break;
        case "fairy":
            imagenSrc = "images/Hada.png";
            break;
        case "ice":
            imagenSrc = "images/Hielo.png";
            break;
        case "fighting":
            imagenSrc = "images/Lucha.png";
            break;
        case "normal":
            imagenSrc = "images/Normal.png";
            break;
        case "psychic":
            imagenSrc = "images/Psiquico.png";
            break;
        case "rock":
            imagenSrc = "images/Roca.png";
            break;
        case "dark":
            imagenSrc = "images/Siniestro.png";
            break;
        case "ground":
            imagenSrc = "images/Tierra.png";
            break;
        case "flying":
            imagenSrc = "images/Volador.png";
            break;
        default:
            imagenSrc = "";
            break;
    }
    $(selector).html(`<img src="${imagenSrc}" width="80" height="20">`);
}

function cargarHabilidades(data) {
    for (var i = 0; i < data.abilities.length; i++) {
        // var numHab = 0
        var slot = data.abilities[i].slot
        //numHab++
        switch (slot) {
            case 1:
                var hab1 = data.abilities[i].ability.name
                $.ajax({
                    url: "https://pokeapi.co/api/v2/ability/" + hab1,
                    contentType: "application/json",
                    success: function (ability) {
                        for (let j = 0; j < ability.names.length; j++) {
                            var idioma = ability.names[j].language.name
                            if (idioma == "es") {
                                $("#Hab1").html(`<p>${ability.names[j].name}</p>`)
                            }
                        }
                    }
                })
                break

            case 2:
                var hab2 = data.abilities[i].ability.name
                $.ajax({
                    url: "https://pokeapi.co/api/v2/ability/" + hab2,
                    contentType: "application/json",
                    success: function (ability) {
                        for (let j = 0; j < ability.names.length; j++) {
                            var idioma = ability.names[j].language.name
                            if (idioma == "es") {
                                $("#Hab2").html(`<p>${ability.names[j].name}</p>`)
                            }
                        }
                    }
                })
                break

            case 3:
                var hab3 = data.abilities[i].ability.name
                $.ajax({
                    url: "https://pokeapi.co/api/v2/ability/" + hab3,
                    contentType: "application/json",
                    success: function (ability) {
                        for (let j = 0; j < ability.names.length; j++) {
                            var idioma = ability.names[j].language.name
                            if (idioma == "es") {
                                if (ability.names[j].name == $("#Hab1").text()) {
                                    $("#Hab3").html(`<p></p>`)
                                } else {
                                    $("#Hab3").html(`<p>${ability.names[j].name}</p>`)
                                }
                            }
                        }
                    }
                })
                break

            default:

                break;
        }
        //console.log(data.abilities.length)
        if (data.abilities.length < 3) {
            //console.log("entro en ha2")
            $("#Hab2").html(`<p></p>`)
        }
        if (data.abilities.length == 1) {
            //console.log("entro en ha33")
            $("#Hab2").html(`<p></p>`)
            $("#Hab3").html(`<p></p>`)
        }
    }
}

function cargarPoke(data) {
    $("#btnShiny").prop("disabled", false);
    $("#btnGrito").prop("disabled", false);
    $("#audio").html(`<source src="${data.cries.latest}" type="audio/ogg">`)
    $("#audio")[0].load()
    $("#Poke").html(`<img src="${data.sprites.other["official-artwork"].front_default}">`)
    $("#NumDex").html(`<p>Num PkDex: ${data.id}</p>`)
    $("#NomPoke").html(`<p>${data.species.name}</p>`)
    $("#peso").html(`<p>Peso: ${data.weight} kg</p>`)
    $("#altura").html(`<p>Altura: ${data.height} ft</p>`)
    $("#NomForma").html(`<p>${data.forms[0].name}</p>`)
    $("#btnGmax").prop("disabled", true);
    $("#btnMega").prop("disabled", true);
    $("#btnForma").prop("disabled", true);
}

function cargarError() {
    $('#modalError').modal('show');
    $("#btnShiny").prop("disabled", true);
    $("#btnForma").prop("disabled", true);
    $("#btnGrito").prop("disabled", true);
    $("#btnGmax").prop("disabled", true);
    $("#btnMega").prop("disabled", true);
    $("#Poke").html(`<img src="images/MissingNo.png">`)
    $("#NumDex").html(`<p>???</p>`)
    $("#NomPoke").html(`<p>MissingNo</p>`)
    $("#imagenTipo").html(`<img src="images/Null.png">`)
    $("#imagenTipo2").html(`<img src="">`)
    $("#Hab1").html(`<p></p>`)
    $("#Hab2").html(`<p></p>`)
    $("#Hab3").html(`<p></p>`)
    actualizarAncho("#statHp", 0)
    actualizarAncho("#statAtk", 0)
    actualizarAncho("#statDef", 0)
    actualizarAncho("#statSpAtk", 0)
    actualizarAncho("#statSpDef", 0)
    actualizarAncho("#statSpd", 0)
}