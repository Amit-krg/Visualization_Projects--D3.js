import random
import pandas as pd
import math
import numpy as np
from sklearn import cluster as Kcluster, metrics as SK_Metrics
from sklearn.preprocessing import StandardScaler
from sklearn import preprocessing
import matplotlib.pyplot as pp
from sklearn.manifold import Isomap,MDS
from sklearn.decomposition import PCA
from flask import Flask
from flask import render_template

data_dir="C://wamp64//www//assignment2//static//"


def plot_elbow(dataFrame):
	'''Method to produce k clusters and check SSE values'''
	sse=[]
	for i in range(1,10):
		k_cluster=Kcluster.KMeans(n_clusters=i).fit(dataFrame)
		sse.append(-k_cluster.score(dataFrame))
	out = open(data_dir+'elbow.csv', 'w')
	i=1
	min_max=preprocessing.MinMaxScaler(feature_range=(0,10))
	std_sse=min_max.fit_transform(sse)
	#print(std_sse)
	out.write("K,SSE\n")
	for row in std_sse:
		out.write('%d,%f' % (i,row))
		out.write('\n')
		i+=1;
	out.close()
	
def random_sampling(dataFrame,fraction):
	'''A method to generate random sample by taking fraction of the given samples'''
	
	rows = random.sample((list)(dataFrame.index), (int)(len(dataFrame)*fraction))
	return dataFrame.ix[rows]
	#print(dataFrame)

def stratified_sampling(dataFrame,fraction,clust_count):
	'''Method to perform clustering and then sampling, Cluster generation is done using scikit library of
	python'''
	k_cluster=Kcluster.KMeans(n_clusters=clust_count).fit(dataFrame)    
	total_len= len(dataFrame)
	total=total_len *fraction
	t1=total/3
	t2=t1
	t3=t1
	strate_sample=[]
	for i in range(total_len):
		if k_cluster.labels_[i]==0 and t1>0:
			strate_sample.append(dataFrame.ix[i])
			t1-=1
		elif k_cluster.labels_[i]==1 and t2>0:
			strate_sample.append(dataFrame.ix[i])
			t2-=1
		elif k_cluster.labels_[i]==2 and t3>0:
			strate_sample.append(dataFrame.ix[i])
			t3-=1
		else :
			break;
	#print(strate_sample)
	return strate_sample   

#eigen values for a particular data column
def scree(dataframe):
	'''Eigen values for each each component'''
	#print(adaptiveSample)
	X_std = StandardScaler().fit_transform(dataframe)
	cor_mat1 = np.corrcoef(X_std.T)
	eig_vals, eig_vecs = np.linalg.eig(cor_mat1)
	sort_eig=sorted(eig_vals,reverse=True)
	return sort_eig	

def generate_loadings(dataframe,type):
	std_input = StandardScaler().fit_transform(dataframe)
	pca = PCA(n_components=3)
	pca.fit_transform(std_input)

	loadings = pca.components_
	squared_loadings = []
	a = np.array(loadings)
	a = a.transpose()
	for i in range(len(a)):
		squared_loadings.append(np.sum(np.square(a[i])))
	df_attributes = pd.DataFrame(pd.DataFrame(dataframe).columns)
	df_attributes.columns = ["attributes"]
	df_sqL = pd.DataFrame(squared_loadings)
	df_sqL.columns = ["s_loadings"]
	sample = df_attributes.join([df_sqL])
	sample = sample.sort_values(["s_loadings"], ascending=[False])
	#saving all the loadings with columns
	sample.to_csv(data_dir+"loadings_"+type+".csv", sep=',',index=False)
	return sample

#get top3 loadings from the squared loadings
def getTop3(sloadings, type):
	top3 = sloadings.head(n = 3)
	return top3['attributes'].values.tolist()

def createFile(random_sample, strat_sample, file_name):
	random_sample.columns = ["r1","r2"]
	strat_sample.columns = ["a1","a2"]
	sample = random_sample.join([strat_sample])

	file_name = data_dir + file_name +".csv"
	sample.to_csv(file_name, sep=',')
	
def write_to_file(sample,filename):
	out= open(filename,'w')
	out.write("Eigen_val\n");
	for row in sample:
		out.write("%f"% row)
		out.write('\n')
	out.close()   



def find_pca(dataframe):
	'''
	Method to generate the PCA components. For now its generates 2 components
	'''
	pca=PCA(n_components=2)
	return pd.DataFrame(pca.fit_transform(dataframe)) 

def find_mds(dataframe, type):
	'''Method to computer MDS for different distance type'''	
	
	dis_mat = SK_Metrics.pairwise_distances(dataframe, metric = type)
	mds = MDS(n_components=2, dissimilarity='precomputed')
	return pd.DataFrame(mds.fit_transform(dis_mat))     
	

def main():
	'''
	taking 20% of the data to generate random sample and stratified samples and then 
	used them to find PCA and mds data
	''' 
	data=pd.read_csv("C://wamp64//www//assignment2//Benefits1.csv")

	#generating normalized data samples
	min_max_scaler = preprocessing.MinMaxScaler()
	np_scaled = min_max_scaler.fit_transform(data)
	data = pd.DataFrame(np_scaled)
	#generate the random sample
	rand_sample=random_sampling(data,0.2)

	plot_elbow(data) # based on elbow value of k is chosen

	#k-means cluster+ sampling
	strat_sample=stratified_sampling(data,0.2,3)
   
	#get the scree plot to check top PCA component
	write_to_file(scree(rand_sample),data_dir+"scree_random.csv")
	write_to_file(scree(strat_sample),data_dir+"scree_strat.csv")

	#generate loading for strat samples
	squared_loading=generate_loadings(strat_sample,"strat")
	
	#find top3 in strat samples and write to file
	 
	top_attr=getTop3(squared_loading,"strat")
	data.ix[:, top_attr].to_csv(data_dir+"top_strat.csv", sep=',',index=False)
	
	#generate loading for random samples
	squared_loadings=generate_loadings(rand_sample,"random")  
	
	top_attr= getTop3(squared_loadings,"random")
	data.ix[:, top_attr].to_csv(data_dir+"top_random.csv", sep=',',index=False)

	#generate PCA data
	createFile(find_pca(rand_sample),find_pca(strat_sample),"pca")
	
	#generate mds data
	mds_list= ["euclidean","correlation"]
	for type_mds in mds_list:
		createFile(find_mds(rand_sample,type_mds),find_mds(strat_sample,type_mds),type_mds)
	
	print("done")
	
	
app = Flask(__name__)

@app.route("/")
def index():
	return render_template("index.html")
if __name__ == "__main__":
	main()
	app.run(host='127.0.0.1',port=5001,debug=True)    
