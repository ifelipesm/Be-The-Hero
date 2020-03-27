import React, {useEffect,useState} from 'react';
import {View,Image,Text,TouchableOpacity,FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Feather} from '@expo/vector-icons';

import api from '../../Services/Api';

import logoImg from '../../assets/logo.png';

import style from './style';

export default function Incidents(){
    const [incidents,setIncidents] = useState([]);
    const [total, setTotal] = useState(0);
    const [page,  setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    function navigateToDetail(incident){
        navigation.navigate('Detail', { incident });
    }

    async function loadIncidents(){
    if(loading){
        return;
    }

    if(total > 0 && incidents.length == total){
        return;
    }

    setLoading(true);

    const response = await api.get('incidents',{
        params:{ page }
    });
    setIncidents([... incidents , ... response.data]); 
    setTotal(response.headers['x-total-count']);
    setPage(page+1);  
    setLoading(false);
    }

    useEffect(() => {
       loadIncidents();
    },[])

    return(
       <View style={style.container}>
           
           <View style={style.header}>
               <Image source={logoImg} />
               <Text style={style.headerTextBold}>
                   Total de <Text style={style.headerTextBold}>{total} casos. </Text>
                </Text>
           </View>
           
           <Text style={style.title}>Bem-Vindo!</Text>
           <Text style={style.description}>Escolha um dos casos abaixo e salve o dia.</Text>
            

            <FlatList
            data={incidents}
            style={style.incidentList}
            keyExtractor={incident => String(incident.id)}
            showsVerticalScrollIndicator={false}
            onEndReached={loadIncidents}
            onEndReachedThreshold={0.2}
            renderItem={({ item: incident }) => (
                <View style={style.incident}>
                    <Text style={style.incidentProperty}>ONG:</Text>
                    <Text style={style.incidentValue}>{incident.name}</Text>

                    <Text style={style.incidentProperty}>Caso:</Text>
                    <Text style={style.incidentValue}>{incident.title}</Text>

                    <Text style={style.incidentProperty}>Valor:</Text>
                    <Text style={style.incidentValue}>
                        {Intl.NumberFormat('pt-BR',
                        {
                            style: 'currency', 
                            currency: 'BRL' 
                        }).format(incident.value)}
                    </Text>

                    <TouchableOpacity
                        style={style.detailsButton}
                        onPress={()=>navigateToDetail(incident)}
                    >
                    <Text style={style.detailsButtonText}>Ver mais detalhes</Text>
                    <Feather name="arrow-right" size={16} color="#E02041" />
                    </TouchableOpacity>
                </View>
            )}
            />
            </View>
    );
}